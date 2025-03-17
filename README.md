Shelly Coffee Grinder Script

Dieses Skript steuert eine Kaffeemühle über ein Shelly-Gerät. Der Motor startet sofort, und die Mahldauer wird anhand eines Potentiometers (Poti) bestimmt.

Funktionen

Sofortiger Start des Motors beim Drücken des Tasters.

Automatische Erkennung der Mahldauer anhand des Potentiometer-Werts:

1–2 Striche → Eine Tasse

Mehr als 2 Striche → Zwei Tassen

Konfigurierbare Laufzeiten für eine und zwei Tassen.

Konfiguration

Die Mahldauer kann in Millisekunden angepasst werden:

let CONFIG = {
  eineTasseMahlzeit: 4000,    // 4 Sekunden für eine Tasse
  zweiTassenMahlzeit: 8000,   // 8 Sekunden für zwei Tassen
  inputId: 0,                 // Eingangspin für den Taster
  switchId: 0                // Schaltausgang für die Mühle
};

Installation

Das Skript auf ein Shelly-Gerät hochladen.

Verwendung

Poti-Wert auswerten:

1–2 Striche: Mahlt für eine Tasse.
Mehr als 2 Striche: Mahlt für zwei Tassen.

Taste drücken: Der Motor startet sofort.

Debugging

Über die Shelly-Weboberfläche kann die Skriptausgabe überprüft werden.

Das Skript gibt Statusmeldungen über print() aus.
