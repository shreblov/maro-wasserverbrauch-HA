# Maro Model 1 Wasserverbrauchsbenachrichtigung mit Home Assistant
Ich nutze die Maro kein bis zwei mal pro Tag, pro Bezug verbrauche ich ca. 0,2 bis 0,3 L Wasser. Dadurch ist eine tägliche Routine wie z. B. Auffüllen des Wassertanks immer morgens für mich nicht sinnvoll. Entgegen statistischer Wahrscheinlichkeit erscheint die Warnung "Bitte Wasser nachfüllen" immer zur Unzeit.  
Dieses Repository enthält die Anleitung und den Code, den Wert für den Wasserverbrauch der Maro von der Maro Home Webseite auszulesen und in Home Assistant abzuspeichern. Wenn der aktuelle Wasserverbrauchswert höher als ein eingestellter Grenzwert ist, wird eine Benachrichtigung über Signal gesendet. Bei welchem Wasserbrauchswert und zu welchem Zeitpunkt die Benachrichtigung erfolgen soll, kann individuell konfiguriert werden.  
Die Vorgehensweise orientiert sich an [Scraping dynamic websites...](https://community.home-assistant.io/t/guide-scraping-dynamic-websites-with-browserless-multiscrape-v2-update/665676) von 2024 mit einigen Anpassungen/Erweiterungen von mir.

## Disclaimer
Ich bin privater Besitzer einer Maro Model 1. Dieses Repository habe ich für meinen eigenen Bedarf erstellt und ist in meiner Home Assistant Installation funktionsfähig. Gewährleistung und Haftung bei der Nutzung durch Dritte schließe ich aus.
siehe [Fehlersuche](#Fehlersuche)
## Voraussetzungen
- Maro Home Account und Maro Model 1 in Maro Home eingebunden. 
- Home Assistant, eingerichteter [Benachrichtigungsdienst](https://www.home-assistant.io/integrations/#notifications). Alternativ kann auch der Voice PE für Sprachausgabe verwendet oder sein LED Ring eingeschaltet werden.
- Ggf. Kenntnisse im Umgang mit dem Entwicklermodus des genutzten Browsers.  
## Vollständiges Backup von Home Assistant
Die Installation bewegt sich vollständig innerhalb von Home Assistant mit den üblichen Methoden. Dennoch empfehle ich vor Beginn der Installation ein komplettes Backup von Home Assistant und das Backup herunterzuladen. 
## Fehlersuche
## Support
Kein Support.


