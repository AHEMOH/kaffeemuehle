let CONFIG = {
  eineTasseMahlzeit: 4000,    // Mahlzeit in Millisekunden für eine Tasse (4 Sekunden)
  zweiTassenMahlzeit: 8500,   // Mahlzeit in Millisekunden für zwei Tassen (8 Sekunden)
  entscheidungszeit: 3,       // Zeit in Sekunden, nach der zwischen kurz und lang entschieden wird
  inputId: 0,
  switchId: 0,
};

// Eingangsmodus auf "detached" setzen, um volle Kontrolle über den Eingang zu haben
Shelly.call("Switch.SetConfig", {
  id: CONFIG.switchId,
  config: {
    in_mode: "detached",
  },
});

let pressStartTime = 0;
let buttonState = 0;
let autoStarted = false;

Shelly.addEventHandler(function (event) {
  if (typeof event.info.event === "undefined") return;
  
  // Nur Events vom konfigurierten Eingang bearbeiten
  if (event.info.component === "input:" + JSON.stringify(CONFIG.inputId)) {
    
    // Tastendruck beginnt
    if (event.info.event === "btn_down") {
      pressStartTime = Date.now();
      buttonState = 1;
      autoStarted = false;
      print("Tastendruck begonnen");
      
      // Motor sofort starten mit Standard-Mahldauer für eine Tasse
      Shelly.call("Switch.Set", {
        id: CONFIG.switchId,
        on: true,
        toggle_after: CONFIG.eineTasseMahlzeit / 1000
      });
      
      // Timer für automatische Erkennung eines langen Tastendrucks
      let intervalId = Timer.set(100, true, function() {
        if (buttonState === 1) {
          let currentDuration = (Date.now() - pressStartTime) / 1000;
          
          // Nach Entscheidungszeit automatisch für zwei Tassen verlängern
          if (currentDuration >= CONFIG.entscheidungszeit && !autoStarted) {
            print("Lang gedrückt - Verlängere Mahldauer für zwei Tassen");
            autoStarted = true;
            
            // Motorlaufzeit auf zwei Tassen verlängern
            Shelly.call("Switch.Set", {
              id: CONFIG.switchId,
              on: true,
              toggle_after: (CONFIG.zweiTassenMahlzeit - currentDuration ) / 1000
            });
          }
        } else {
          Timer.clear(intervalId);
        }
      });
    }
    
    // Taster wurde losgelassen
    else if (event.info.event === "btn_up" && buttonState === 1) {
      buttonState = 0;
      print("Taster losgelassen");
    }
    
    // "push"-Events ignorieren
    if (event.info.event.indexOf("push") >= 0) return;
  }
});

print("Kaffeemühlen-Skript gestartet - Motor startet sofort, Entscheidungszeit: " + CONFIG.entscheidungszeit + "s, Eine Tasse: " + CONFIG.eineTasseMahlzeit + "ms, Zwei Tassen: " + CONFIG.zweiTassenMahlzeit + "ms");
