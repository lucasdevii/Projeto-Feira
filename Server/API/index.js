// =========================
// ✅ IMPORTAÇÕES & CONFIGS
// =========================
const cors = require("cors");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server: IOServer } = require("socket.io");
const { error } = require("console");
const { type } = require("os");

const prisma = new PrismaClient();
const app = express();

const httpServer = http.createServer(app);

const accountServer = process.env.ACOUNT_SERVER;
const acountPass = process.env.PASS_ACOUNT;
const keyServer = process.env.KEY_SERVER;

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.89", // IP do ESP (caso ele envie origin)
  "http://192.168.0.26", // Seu IP local, navegador etc
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS bloqueado para: " + origin));
      }
    },
    credentials: true,
  })
);
const io = new IOServer(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Socket.IO CORS"));
      }
    },
    credentials: true,
  },
});
function tokenExtract(cookieString) {
  if (!cookieString) return null;
  const match = cookieString.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

io.on("connection", (socket) => {
  console.log("-- Cliente Conectado --", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente Disconectado: ", socket.id);
  });
});

const PORT = 3005;
httpServer.listen(PORT, () => {
  console.log("Rodando server http://localhost:3005");
});

//CONFIG WEBSOCKET
io.use(async (socket, next) => {
  const cookiesFull = socket.handshake.headers.cookie;
  const token = tokenExtract(cookiesFull);

  if (!token) return next(new Error("Usurio não cadastrado"));

  try {
    const payload = jwt.verify(token, keyServer);

    const Exists = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { email: true },
    });

    if (!Exists) return next(new Error("Token inválido"));

    socket.userEmail = payload.email;
    next(); // ✅ Libera a conexão
  } catch (err) {
    return next(new Error("Token inválido"));
  }
});

// ✅ Evento de conexão (executado só uma vez, por cliente autenticado)
io.on("connection", (socket) => {
  const email = socket.userEmail;

  if (email) {
    socket.join(email); // entra em sala com seu email
    console.log("✅ Socket conectado e entrou na sala:", email);
  }

  socket.emit("bemVindo", `Olá, ${email}`);
});
// =====================
// ✅ FUNÇÕES AUXILIARES
// =====================
const getEmail = async (req) => {
  try {
    const token = req.cookies.token;
    console.log("Token recebido:", token);

    if (!token) {
      console.log("Token ausente");
      return null;
    }

    const payload = jwt.verify(token, keyServer);
    console.log("Payload decodificado:", payload);
    return payload.email;
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return null;
  }
};
setInterval(async () => {
  try {
    const deletados = await prisma.tokentabel.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(), // menor que agora → expirado
        },
      },
    });

    if (deletados.count > 0) {
      console.log(`${deletados.count} tokens expirados removidos.`);
    }
  } catch (err) {
    console.error("Erro ao remover tokens expirados:", err);
  }
}, 5 * 60 * 1000); // 5 minutos
const keepIdUser = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id;
};

const deviceCadaster = async (name, local, code, userID) => {
  try {
    console.log("🔧 deviceCadaster →", { name, local, code, userID });

    const device = await prisma.device.findUnique({
      where: { code: parseInt(code) },
    });

    if (!device) {
      console.log("❌ Dispositivo com code", code, "não encontrado no banco.");
      return false;
    }

    const relation = await prisma.userDevices.findUnique({
      where: {
        userId_deviceId: {
          userId: userID,
          deviceId: device.id,
        },
      },
    });

    if (relation) {
      console.log("⚠️ Dispositivo já vinculado a este usuário.");
      return true;
    }

    const created = await prisma.userDevices.create({
      data: {
        userId: userID,
        deviceId: device.id,
        customName: name,
        customLocal: local,
        code: parseInt(code),
      },
    });

    console.log("✅ Dispositivo vinculado ao usuário:", created);
    return true;
  } catch (err) {
    console.error("❌ Erro em deviceCadaster:", err);
    return false;
  }
};
//ESPECIFICAÇÃO DO EMAIL
const transport = nodeMailer.createTransport({
  service: "gmail", // ou "hotmail", "outlook", "mailtrap", etc.
  auth: {
    user: accountServer, // seu e-mail de envio
    pass: acountPass, // senha ou app password
  },
});

// =====================
// ✅ ROTAS
// =====================
app.post("/Device/Register", async (req, res) => {
  try {
    console.log("📥 Requisição recebida em /Device/Register");

    const email = await getEmail(req);
    console.log("📧 Email extraído:", email);
    if (!email) return res.status(401).json({ erro: "Não autenticado" });

    const UserID = await keepIdUser(email);
    console.log("🆔 UserID encontrado:", UserID);
    if (!UserID)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    const { name, code, local } = req.body;
    console.log("📦 Dados recebidos:", { name, code, local });

    if (!name || !code || !local || isNaN(parseInt(code))) {
      return res
        .status(400)
        .json({ erro: "Dados inválidos no corpo da requisição" });
    }

    const created = await deviceCadaster(name, local, code, UserID);
    console.log("🔄 Resultado do deviceCadaster:", created);

    if (!created) {
      return res
        .status(404)
        .json({ erro: "Dispositivo não encontrado ou erro ao registrar" });
    }

    return res.status(201).json({
      mensagem: "Dispositivo registrado com sucesso!",
      dispositivo: { name, local, code },
    });
  } catch (err) {
    console.error("🔥 ERRO EM /Device/Register:", err);
    return res
      .status(500)
      .json({ erro: "Erro interno ao registrar dispositivo." });
  }
});

// =====================
// ✅ OUTRAS FUNÇÕES AUXILIARES
// =====================

const userCreate = async (email, name, passwordB) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password: passwordB,
    },
  });
};

const findUserEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      password: true,
      id: true,
    },
  });
};

const cryptoPass = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// =====================
// ✅ RECUPERAÇÃO DE SENHA
// =====================

app.post("/User/Email/Help", async (req, res) => {
  try {
    const email = req.body.email;
    const nameObj = await prisma.user.findUnique({
      where: { email },
      select: { name: true },
    });

    if (!nameObj) {
      return res
        .status(404)
        .json({ response: false, message: "Usuário não encontrado" });
    }

    const name = nameObj.name;

    await prisma.tokentabel.deleteMany({
      where: { emailUser: email, type: "RESET_PASSWORD" },
    });

    const codeConfirmation = Math.floor(100000 + Math.random() * 900000);

    await prisma.tokentabel.create({
      data: {
        token: codeConfirmation,
        emailUser: email,
        nameUser: name,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        type: "RESET_PASSWORD",
        passwordUser: "",
      },
    });

    await transport.sendMail({
      from: `"InfoGás" <${accountServer}>`,
      to: email,
      subject: "Confirmação de Email",
      html: `<h1>Olá ${name}! Seu código de recuperação é:</h1><h1>${codeConfirmation}</h1>`,
    });

    console.log("E-mail enviado para:", email);
    return res
      .status(200)
      .json({ response: true, message: "Código enviado com sucesso" });
  } catch (err) {
    console.error("Erro em USER/EMAIL/HELP:", err);
    return res
      .status(500)
      .json({ response: false, message: "Erro ao enviar e-mail" });
  }
});

app.post("/User/Email/Help/CodeVerify", async (req, res) => {
  try {
    const codeRecept = req.body.code;
    const code = parseInt(codeRecept);

    if (isNaN(code) || String(code).length !== 6) {
      return res.status(400).json({ valid: false, message: "Código inválido" });
    }

    const exists = await prisma.tokentabel.findUnique({
      where: { token: code },
      select: { emailUser: true }, // ✅ Corrigido: letra maiúscula correta
    });

    if (exists) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(410).json({ valid: false });
    }
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Erro interno no servidor" });
  }
});

app.post("/User/Email/Help/Changepass", async (req, res) => {
  try {
    const { valueInputEmail, confirmPassword } = req.body;

    if (!valueInputEmail || !confirmPassword) {
      return res
        .status(400)
        .json({ response: false, message: "Campos obrigatórios não enviados" });
    }

    console.log("➡️ Requisição recebida para mudar senha de:", valueInputEmail);

    const passwordHash = await bcrypt.hash(confirmPassword, 10);

    console.log("🔐 Senha criptografada");

    await prisma.tokentabel.deleteMany({
      where: {
        emailUser: valueInputEmail,
        type: "RESET_PASSWORD",
      },
    });

    console.log("🧹 Tokens antigos apagados");

    const updated = await prisma.user.update({
      where: { email: valueInputEmail },
      data: {
        password: passwordHash,
      },
    });

    console.log("✅ Senha atualizada para:", updated.email);

    return res
      .status(200)
      .json({ response: true, message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.log("❌ Erro na mudança de senha:", error);
    return res
      .status(500)
      .json({ response: false, message: "Erro interno ao atualizar a senha" });
  }
});
// =====================
// ✅ LOGIN / LOGOUT / VERIFICAÇÃO
// =====================

app.post("/User/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserEmail(email);

  if (!user) {
    return res.status(404).json({ exists: false });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ exists: false });
  }

  const token = jwt.sign({ email }, keyServer);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "",
    })
    .status(200)
    .json({ exists: true });
});

app.post("/User/Logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    sameSite: "",
    secure: false,
  });
  res.sendStatus(200);
});

app.post("/User/Verification", async (req, res) => {
  try {
    const email = await getEmail(req);

    if (!email) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Token ausente ou inválido" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true },
    });
    if (!user) {
      res.clearCookie("token");
      return res
        .status(404)
        .json({ erro: "Usuário não encontrado", exists: false });
    }

    return res.status(200).json({ exists: true, name: user.name });
  } catch (err) {
    res.clearCookie("token");
    console.log("Deu erro aqui");
    return res.status(403).json({
      erro: "Token inválido ou expirado",
      exists: false,
    });
  }
});

// =====================
// ✅ CADASTRO DE USUÁRIO
// =====================

app.post("/User/Cadaster", async (req, res) => {
  try {
    const code = req.body.codeNumber;

    const existingCode = await prisma.tokentabel.findUnique({
      where: {
        token: code,
      },
      select: {
        passwordUser: true,
        nameUser: true,
        emailUser: true,
        expiresAt: true, // 💡 importante se você quiser verificar validade
      },
    });

    // ⚠️ Código não existe
    if (!existingCode) {
      return res
        .status(409)
        .json({ response: false, message: "Código inválido." });
    }

    // ⚠️ Código expirado (opcional, mas recomendado)
    if (existingCode.expiresAt < new Date()) {
      return res
        .status(409)
        .json({ response: false, message: "Código expirado." });
    }

    const { passwordUser, nameUser, emailUser } = existingCode;

    // ⚠️ Pode lançar erro se o email já estiver cadastrado
    try {
      await userCreate(emailUser, nameUser, passwordUser);
    } catch (err) {
      if (err.code === "P2002") {
        return res
          .status(409)
          .json({ response: false, message: "Email já cadastrado." });
      }
      throw err;
    }

    await prisma.tokentabel.delete({
      where: { token: code },
    });

    const token = jwt.sign({ email: emailUser }, keyServer); // ✅ Corrigido aqui!

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "",
    });

    res.status(201).json({ response: true });
  } catch (err) {
    console.error("Erro inesperado em /User/Cadaster:", err);
    res
      .status(500)
      .json({ response: false, message: "Erro interno no servidor." });
  }
});
app.post("/User/Cadaster/Exists", async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const Exists = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });
    if (Exists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
      console.log("Esse rapaz n existe ainda");
    }
  } catch (error) {
    console.log("erro na confirmação de existencia: ", error);
  }
});
app.post("/User/Cadaster/Email", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email) {
      return console.log("email sem valor"), res.status(404);
    }

    const codeConfirmation = Math.floor(100000 + Math.random() * 900000);

    const passwordHash = await cryptoPass(password);
    const userInTableExists = await prisma.tokentabel.findUnique({
      where: { emailUser: email },
    });

    if (userInTableExists) {
      try {
        await transport.sendMail({
          from: `"InfoGás" <${accountServer}>`,
          to: email,
          subject: "Confirmação de Email",
          html: `<h1>Olá ${name}! seu codigo é:</h1>
      <h1>${codeConfirmation}</h1>`,
        });
        await prisma.tokentabel.update({
          where: { emailUser: email },
          data: {
            token: codeConfirmation,
            passwordUser: passwordHash,
            nameUser: name,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          },
        });

        return res.status(200).json({ response: true });
      } catch (err) {
        console.log(
          "Erro no envio do email...(que já esta pendente no banco)",
          err
        );
        return res.status(401).json({ response: false });
      }
    }
    await transport.sendMail({
      from: `"InfoGás" <${accountServer}>`,
      to: email,
      subject: "Confirmação de Email",
      html: `<h1>Olá ${name}! seu codigo é:</h1>
      <h1>${codeConfirmation}</h1>`,
    });
    await prisma.tokentabel.create({
      data: {
        token: codeConfirmation,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expira em 10 minutos
        emailUser: email,
        nameUser: name,
        passwordUser: passwordHash,
        type: "SIGNUP",
      },
    });

    res.status(200).json({ response: true });
  } catch (err) {
    res.status(401).json({ response: false });
    console.log("Erro no envio do email...", err);
  }
});
// =====================
// ✅ LISTAGEM E VERIFICAÇÃO DE DISPOSITIVO
// =====================

app.get("/Device/Exist/:id", async (req, res) => {
  try {
    const email = await getEmail(req); // pega o e-mail do usuário autenticado
    if (!email) return res.status(401).json({ error: "Não autenticado" });

    const code = parseInt(req.params.id);
    if (isNaN(code)) {
      return res.status(400).json({ error: "Código inválido" });
    }

    // Verifica se o dispositivo existe
    const device = await prisma.device.findUnique({
      where: { code },
      select: { id: true },
    });

    const ExistsAll = !!device;

    let ExistsInUser = false;

    if (device) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      const userDevice = await prisma.userDevices.findFirst({
        where: {
          userId: user?.id,
          deviceId: device.id,
        },
      });

      ExistsInUser = !!userDevice;
    }

    res.status(200).json({ ExistsInUser, ExistsAll });
  } catch (error) {
    console.error("Erro em /Device/Exist:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/Device/List", async (req, res) => {
  const email = await getEmail(req);
  if (!email) return res.status(401).json({ erro: "Não autenticado" });

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userDevices: {
        include: {
          device: true,
        },
      },
    },
  });

  if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

  const list = user.userDevices || [];
  res.status(200).json({ devices: list });
});

// =====================
// ✅ DELETAR DISPOSITIVO
// =====================

app.delete("/Device/Delete/:id", async (req, res) => {
  try {
    const email = await getEmail(req);
    if (!email) return res.status(401).json({ mensagem: "Não autenticado" });

    const deviceCode = parseInt(req.params.id);
    if (isNaN(deviceCode)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    const deviceIDObj = await prisma.device.findUnique({
      where: { code: deviceCode },
      select: { id: true },
    });
    deviceID = deviceIDObj.id;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // ✅ Exclusão segura
    const deleteResult = await prisma.userDevices.deleteMany({
      where: {
        userId: user.id,
        deviceId: deviceID,
      },
    });
    console.log("Registros deletados:", deleteResult.count);

    res.sendStatus(204);
  } catch (error) {
    console.error("Erro ao deletar dispositivo:", error);
    res.status(500).json({ error: "Erro interno ao deletar dispositivo" });
  }
});
//status device modificador//
app.post("/Device/Status", async (req, res) => {
  const { status } = req.body;
  const code = Number(req.body.code);
  if (isNaN(code)) {
    return res.status(400).json({ error: "o code não é um number" });
  }

  // Valida status
  if (!["NORMAL", "RISK"].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  try {
    // Atualiza status do dispositivo
    const codeDevice = await prisma.device.update({
      where: { code: code },
      data: {
        detection: status,
        status: true,
      },
      select: { id: true },
    });

    const deviceId = codeDevice.id;

    const userLinks = await prisma.userDevices.findMany({
      where: { deviceId: deviceId }, // agora correto, deviceId é um número
      select: { userId: true },
    });
    const userIds = userLinks.map((link) => link.userId);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { email: true },
    });

    const emails = users.map((u) => u.email);

    // Envia socket para cada e-mail
    for (const email of emails) {
      io.to(email).emit("stateUpdate", { status, code });
      console.log(
        `socket enviado '${status}' por io para o user: ${email} \n -- dispositivo: ${code}`
      );
    }

    return res
      .status(201)
      .json({ mensage: `Deu tudo certo na mudança para ${status}!` });
  } catch (erro) {
    console.error("Erro ao atualizar status:", erro);
    return res
      .status(500)
      .json({ error: "Erro interno ao atualizar status", erro });
  }
});
