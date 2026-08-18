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
- Mindestens 2 Stunden Zeit einplanen
## Vollständiges Backup von Home Assistant
Die Installation bewegt sich vollständig innerhalb von Home Assistant mit den üblichen Methoden. Dennoch empfehle ich vor Beginn der Installation ein komplettes Backup von Home Assistant und das Backup herunterzuladen.
## Installation der browserless App in Home Assistant und ein erster Test
## Weitere Anpassungen in Home Assistant
Unter Einstellungen>Geräte & Dienste>Helfer drei Entitäten für numerische Zahlenwert-Eingabe anlegen:
- input_number.maro_wasserverbrauch_grenzwert mit Minimalwert 0, Maximalwert 10000000, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.
- input_number.maro_wasserverbrauch_aktuell mit Minimalwert 0, Maximalwert 10000000, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.
-  input_number.maro_wasserverbrauch_delta mit Minimalwert 0, Maximalwert 10, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.  Unter Einstellungen>Werkzeuge>Zustände den Wert für input_number.maro_wasserverbrauch_delta auf 1.0 L setzen. Das kann später ggf. angepasst werden.

Optional: im Dashboard eine neue Entitäten-Kachel anlegen, in YAML bearbeiten und den Inhalt der Datei Dashboard Entities Card.yaml einfügen.  

Mit z. B. dem Studio Code Editor drei Verzeichnisse anlegen:
- /config/scripts: hier den Inhalt der Datei browserless_scraper.sh hineinkopieren und als browserless_scraper.sh abspeichern
- /config/js_scrapers : hier den Inhalt der Datei maro_scraper.js hineinkopieren, DEINUSERNAME und DEINPASSWORT ersetzen und als maro_scraper.js abspeichern
- /config/www/browserless: hier legen die Automation und das Script Dateien mit den Wasserverbrauchswerten aktuell und basis an. 

Mit z. B. dem Terminal in das Verzeichnis /config/scripts navigieren und die Datei browserless_scraper.sh ausführbar machen:  
chmod +x browserless_scraper.sh  

Unter Einstellungen>Automationen & Szenen>Scripts>Skript erstellen, in den YAML Modus wechseln und den Inhalt aus der Datei … hineinkopieren und abspeichern unter dem Namen Maro Wasserverbrauch nach auffuellen. Entität-ID sollte dann script.maro_wasserverbrauch_nach_auffuellen sein. Dieses Script berechnet den Grenzwert aus aktuellem Wasserverbrauchswert + Delta. Ein neuer Wert für Delta wird erst nach (!) Aufruf des Scripts berücksichtigt.   

Unter Einstellungen>Automationen & Szenen>Automationen>Automation erstellen, in den YAML Modus wechseln und den Inhalt aus der Datei … hineinkopieren und abspeichern unter dem Namen Maro Wasserverbrauch Nachricht. Entität-ID sollte dann automation.maro_wasserverbrauch_nachricht sein.   
In der Automation den Auslöser „Sobald“ an die eigenen Erfordernisse anpassen. Die von mir gesetzten Zeiten/Tage sind vor meinen üblichen Bezugszeiten.  
Abschließend noch den Schritt „Send a notification with signal“ an die eigenen Anforderungen anpassen (z. B. anderer Messenger oder LED an Voice PE einschalten oder oder oder…).   

Testen: Das Script ausführen und den Trace prüfen. Wenn alles geklappt hat, sollte in /config/www/browserless eine Datei maro_wasserverbrauch_grenzwert.json mit dem aktuellen Wasserverbrauchswert angelegt sein. Optional sollte der Wert plus Delta auf den Dashboard in der neuen Entitäten-Kachel angezeigt sein. Wenn das Script funktioniert, die Automation testen. Wenn die ebenfalls funktioniert, sollte in dem o. g. Verzeichnis die Datei maro_wasserverbrauch_aktuell.json mit dem aktuellen Wasserverbrauchswert angelegt sein, ebenso optional sichtbar in der Entitäten-Kachel auf dem Dashboard.
## Fehlersuche
## Support
Kein Support.


