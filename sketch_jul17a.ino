#include <ESP8266WiFi.h>     // Biblioteca principal para funcionalidades Wi-Fi
#include <ESP8266HTTPClient.h> // Biblioteca para requisições HTTP
#include <WiFiClient.h>      // Necessário para o objeto WiFiClient da HTTPClient

// --- Definições de Pinos e Constantes ---
const int LED_PIN = D7;     // Pino para o LED (usando D7 no NodeMCU/ESP-01)
const int BUZZER_PIN = D8;  // Pino para o Buzzer (usando D8 no NodeMCU/ESP-01)
const int SENSOR_PIN = A0;  // Pino analógico para o sensor (A0 no NodeMCU/ESP-01)
const int BUTTON_PIN = D6;
const int DEVICE_CODE = 144728; // Código de identificação do dispositivo
//IPS
IPAddress local_IP(192, 168, 0, 89);     // Mesmo range do servidor
IPAddress gateway(192, 168, 0, 1);       // IP do roteador
IPAddress subnet(255, 255, 255, 0);

// --- Credenciais da Rede Wi-Fi ---
const char* WIFI_SSID = "brisa-BRISATURBO"; // Nome da rede Wi-Fi
const char* WIFI_PASSWORD = "icaroalamo96"; // Senha da rede Wi-Fi

// --- Endereço do Servidor ---
const char* SERVER_URL = "http://192.168.0.26:3005/Device/Status"; // URL do endpoint da API

// --- Limiar do Sensor ---
const int SENSOR_THRESHOLD = 360; // Valor limite para considerar 'NORMAL' ou 'RISK'

// --- Intervalos de Tempo para Operações (em milissegundos) ---
const long SENSOR_CHECK_INTERVAL = 500;   // Frequência de leitura do sensor e lógica
const long SERIAL_DEBUG_INTERVAL = 2000;  // Frequência das mensagens de debug no Serial
const long BUTTON_BOUNCE_INTERVAL = 1000;

// --- Variáveis de Controle de Tempo ---
unsigned long lastSensorCheckMillis = 0; // Último momento que o sensor foi lido/processado
unsigned long lastDebugPrintMillis = 0;  // Último momento que o debug foi impresso
unsigned long lastDebounceButton = 0;

// --- Variáveis de Estado ---
String currentSensorStatus = "UNKNOWN"; // Armazena o status atual do sensor ("NORMAL", "RISK", "UNKNOWN")
bool isWifiConnected = false;           // Flag para indicar o status da conexão Wi-Fi

// --- Objeto Cliente HTTP ---
WiFiClient wifiClient; // Objeto WiFiClient para ser usado pela HTTPClient

// --- Função para Enviar a Requisição POST ao Servidor ---
void sendPostRequest(String status) {
  // Verifica se há conexão Wi-Fi antes de tentar enviar
  if (!isWifiConnected) {
    Serial.println("[HTTP] Não conectado ao Wi-Fi. POST não enviado.");
    return;
  }

  HTTPClient http; // Cria um objeto HTTPClient
  Serial.print("[HTTP] Iniciando conexão com o servidor: ");
  Serial.println(SERVER_URL);

  // Inicia a conexão HTTP. Usa 'wifiClient' para manter a conexão se for o caso.
  http.begin(wifiClient, SERVER_URL);
  http.addHeader("Content-Type", "application/json"); // Define o cabeçalho JSON

  // Cria a string JSON para o corpo da requisição
  String jsonPayload = "{\"code\":" + String(DEVICE_CODE) + ",\"status\":\"" + status + "\"}";
  Serial.print("[HTTP] Enviando JSON: ");
  Serial.println(jsonPayload);

  // Envia a requisição POST
  int httpCode = http.POST(jsonPayload);

  // Processa a resposta do servidor
  if (httpCode > 0) { // Se o código HTTP for positivo (200 OK, 400 Bad Request, etc.)
    Serial.print("[HTTP] Resposta do Servidor (Código ");
    Serial.print(httpCode);
    Serial.print("): ");
    String payload = http.getString(); // Lê a resposta do servidor
    Serial.println(payload);
  } else { // Se houve erro na conexão ou requisição (código <= 0)
    Serial.print("[HTTP] Erro na requisição POST. Código de erro: ");
    Serial.println(httpCode);
    Serial.print("[HTTP] Detalhes do erro: ");
    Serial.println(http.errorToString(httpCode)); // Mostra o erro detalhado
  }

  http.end(); // Fecha a conexão HTTP e libera recursos
}

// --- Função de Callback para Eventos Wi-Fi ---
// Esta função é chamada automaticamente quando um evento Wi-Fi ocorre (conectado, desconectado, etc.)
void WiFiEvent(WiFiEvent_t event) {
  Serial.printf("[WiFi Event] Evento: %d\n", event); // Imprime o código do evento para debug

  switch (event) {
    case 0: // WiFiEventStationModeGotIP (Este é o valor numérico para 'Conectado e obteve um IP')
      Serial.println(">>> Wi-Fi conectado! IP: " + WiFi.localIP().toString());
      isWifiConnected = true; // Atualiza a flag de conexão
      break;
    case 5: // WiFiEventStationModeDisconnected (Este é o valor numérico para 'Desconectado do Wi-Fi')
      Serial.println(">>> Wi-Fi desconectado. Tentando reconectar...");
      isWifiConnected = false; // Atualiza a flag de conexão
      break;
    case 2: // WiFiEventStationModeConnecting (Este é o valor numérico para 'Tentando conectar (estado intermediário)')
      Serial.println(">>> Wi-Fi conectando...");
      break;
    case 6: // WiFiEventStationModeAuthModeChanged (Este é o valor numérico para 'Modo de autenticação mudou')
      Serial.println(">>> Wi-Fi: Modo de autenticação mudou.");
      break;
    case 3: // WiFiEventStationModeNoAPFound (Este é o valor numérico para 'Nenhuma rede SSID encontrada (WL_NO_SSID_AVAIL)')
      Serial.println(">>> Wi-Fi: Nenhuma rede '" + String(WIFI_SSID) + "' encontrada.");
      break;
    case 1: // WiFiEvent_NoEvent
    case 4: // WiFiEventStationModeIdle
    case 7: // WiFiEventStationModeConnected
    case 8: // WiFiEventSoftAPModeStationConnected
    case 9: // WiFiEventSoftAPModeStationDisconnected
    case 10: // WiFiEventSoftAPModeProbeRequestReceived
    case 11: // WiFiEventSoftAPModeAPStarted
    case 12: // WiFiEventSoftAPModeAPStop
    case 13: // WiFiEventSmartConfigDone
    case 14: // WiFiEventGotIPandMrDNS
    case 15: // WiFiEvent_Max
    default:
      // Ignora outros eventos ou adiciona tratamento se necessário
      break;
  }
}
// --- Função de Configuração (executada uma vez ao iniciar) ---
void setup() {
  // Configura os pinos do LED e Buzzer como OUTPUT
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  // Garante que o LED e o Buzzer estão desligados no início
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("Falha ao configurar IP estático");
  }

  // Inicializa a comunicação serial para debug
  Serial.begin(9600);
  delay(100); // Pequeno atraso para a serial inicializar
  Serial.println("\n--- Iniciando Sistema ESP8266 ---");

  // Configura o modo Wi-Fi para Station (cliente)
  WiFi.mode(WIFI_STA);

  // Define a função WiFiEvent como callback para eventos Wi-Fi
  WiFi.onEvent(WiFiEvent);

  // Inicia a conexão com a rede Wi-Fi.
  // WiFi.setAutoReconnect(true) e WiFi.persistent(true) já são o padrão,
  // mas é bom ter o onEvent para controle mais detalhado.
  Serial.print("Tentando conectar ao Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // Loop de espera inicial pela conexão Wi-Fi (com timeout)
  unsigned long connectAttemptStartTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - connectAttemptStartTime < 20000) { // Tenta por 20 segundos
    delay(500);
    Serial.print("."); // Imprime pontos enquanto tenta conectar
  }

  // Verifica o status final da conexão inicial
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi conectado com sucesso na inicialização!");
  } else {
    Serial.println("\nFalha ao conectar Wi-Fi no tempo esperado.");
    Serial.println("O dispositivo continuará tentando conectar em segundo plano.");
  }
}

// --- Função Principal (executada repetidamente no loop) ---
void loop() {
  unsigned long currentMillis = millis(); // Pega o tempo atual do sistema
  bool BUTTON_CLIKED = digitalRead(BUTTON_PIN);

  if(currentMillis - lastDebounceButton >= BUTTON_BOUNCE_INTERVAL){
    lastDebounceButton = currentMillis;
    if (BUTTON_CLIKED == LOW){
      Serial.println("Reiniciando leitura do ESP8266...");
      ESP.restart();
    }
  }
  // --- Lógica de Leitura do Sensor, LED e Buzzer ---
  if (currentMillis - lastSensorCheckMillis >= SENSOR_CHECK_INTERVAL) {
    lastSensorCheckMillis = currentMillis; // Atualiza o tempo da última leitura

    int sensorValue = analogRead(SENSOR_PIN); // Lê o valor do sensor
    String newSensorStatus;                   // Variável temporária para o novo status

    // Determina o status com base no valor do sensor
    if (sensorValue <= SENSOR_THRESHOLD) {
      newSensorStatus = "NORMAL";
      digitalWrite(LED_PIN, LOW);   // Desliga o LED
      digitalWrite(BUZZER_PIN, LOW); // Desliga o Buzzer
    } else { // sensorValue > SENSOR_THRESHOLD
      newSensorStatus = "RISK";
      digitalWrite(LED_PIN, HIGH);   // Acende o LED
      digitalWrite(BUZZER_PIN, HIGH); // Ativa o Buzzer
    }

    // Se o status do sensor mudou, tenta enviar a requisição POST
    if (newSensorStatus != currentSensorStatus) {
      Serial.print("[Sensor] Status mudou de '");
      Serial.print(currentSensorStatus);
      Serial.print("' para '");
      Serial.print(newSensorStatus);
      Serial.println("'");

      currentSensorStatus = newSensorStatus; // Atualiza o status armazenado
      sendPostRequest(currentSensorStatus);  // Envia o novo status ao servidor
    }
  }

  // --- Mensagens de Debug Serial Periódicas ---
  if (currentMillis - lastDebugPrintMillis >= SERIAL_DEBUG_INTERVAL) {
    lastDebugPrintMillis = currentMillis; // Atualiza o tempo da última impressão de debug

    Serial.print("[DEBUG] Valor Sensor: ");
    Serial.print(analogRead(SENSOR_PIN)); // Lê o sensor novamente para o debug
    Serial.print(" | Status Sensor: ");
    Serial.print(currentSensorStatus);
    Serial.print(" | Wi-Fi: ");
    Serial.print(isWifiConnected ? "CONECTADO" : "DESCONECTADO");
    if (isWifiConnected) {
      Serial.print(" | IP: ");
      Serial.print(WiFi.localIP());
    }
    Serial.println();
  }
  // Pequeno delay para permitir que o WiFi.onEvent() e outras tarefas internas do ESP8266 sejam executadas
  // É bom ter um pequeno delay (1-10ms) em loops muito rápidos para evitar 'watchdog timer' reset,
  // embora o uso de millis() reduza bastante a necessidade de delays maiores.
  delay(1);
}