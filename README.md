# Maro Model 1 Benachrichtigung über Wasserverbrauch mit Home Assistant
Ich nutze die Maro kein bis zwei Mal am Tag, pro Bezug verbrauche ich ca. 0,2 bis 0,3 L Wasser. Dadurch ist eine tägliche Routine wie z. B. Auffüllen des Wassertanks immer morgens für mich nicht sinnvoll. Entgegen statistischer Wahrscheinlichkeit erscheint die Information "Bitte Wasser nachfüllen" immer zur Unzeit.  

  Der Ablauf: nach Befüllen des Wassertanks liest ein manuell gestartetes Home Assistant Script den aktuellen „Wasserverbrauch gesamt“ von der Maro Mein Model 1 Webseite. Zu diesem Wert wird ein Delta-Wert addiert, das ergibt den Grenzwert. Zu selbst festzulegenden Zeiten liest eine Automation den dann aktuellen „Wasserverbrauch gesamt“ und vergleicht diesen mit dem Grenzwert. Ein aktueller Wert größer als der Grenzwert löst die Benachrichtigung aus.  

  Beispiel:   
- Delta-Wert 0.8 L, „Wasserverbrauch gesamt“ bei Auffüllen 40 L, Grenzwert dann 40.8 L.
- Aktueller „Wasserverbrauch gesamt“ 40,4 L, keine Benachrichtigung.
- Aktueller „Wasserverbrauch gesamt“ 41,1 L, Benachrichtigung.

  Grenzwert und Zeitpunkt der Überprüfung sind individuell konfigurierbare.
    
Die Vorgehensweise orientiert sich an [Scraping dynamic websites...](https://community.home-assistant.io/t/guide-scraping-dynamic-websites-with-browserless-multiscrape-v2-update/665676) von 2024 mit einigen Anpassungen/Erweiterungen von mir.

## Disclaimer
Ich bin privater Besitzer einer Maro Model 1. Dieses Repository habe ich für meinen eigenen Bedarf erstellt und ist in meiner Home Assistant Installation funktionsfähig. Gewährleistung und Haftung bei der Nutzung durch Dritte schließe ich aus.
siehe [Fehlersuche](#Fehlersuche)
## Support
Kein Support.
## Voraussetzungen
- Maro Home Zugangsdaten und Maro Model 1 in Maro Home eingebunden. 
- Home Assistant, eingerichteter [Benachrichtigungsdienst](https://www.home-assistant.io/integrations/#notifications). Alternativ kann Voice PE für Sprachausgabe verwendet oder sein LED Ring eingeschaltet werden.
- Ggf. Kenntnisse im Umgang mit dem Entwicklermodus des genutzten Browsers.
- Mindestens 2 Stunden Zeit einplanen.
## Voll-Backup von Home Assistant
Die Installation bewegt sich ausschließlich innerhalb von Home Assistant mit den üblichen Methoden. Dennoch empfehle ich vor Beginn der Installation ein Voll-Backup von Home Assistant zu erstellen und herunterzuladen.
## Installation der browserless App in Home Assistant und ein erster Test
## Weitere Anpassungen in Home Assistant
Unter Einstellungen>Geräte & Dienste>Helfer drei Entitäten für numerische Zahlenwert-Eingabe anlegen:
- input_number.maro_wasserverbrauch_grenzwert mit Minimalwert 0, Maximalwert 10000000, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.
- input_number.maro_wasserverbrauch_aktuell mit Minimalwert 0, Maximalwert 10000000, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.
- input_number.maro_wasserverbrauch_delta mit Minimalwert 0, Maximalwert 10, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.  Unter Einstellungen>Werkzeuge>Zustände den Wert für input_number.maro_wasserverbrauch_delta auf 0.8 L setzen. Das kann später ggf. angepasst werden.

Optional: im Dashboard eine neue Entitäten-Kachel anlegen, in YAML bearbeiten und den Inhalt der Datei [Dashboard Entities Card.yaml](./Dashboard Entities Card.yaml) einfügen.  

Mit z. B. dem Studio Code Editor drei Verzeichnisse und zwei Dateien anlegen:
- /config/scripts<br>
Hier eine neue Datei erzeugen, den Inhalt der Datei [browserless_scraper.sh](./browserless_scraper.sh) hineinkopieren und als browserless_scraper.sh abspeichern.
- /config/js_scrapers<br>
Hier eine neue Datei erzeugen, den Inhalt der Datei [maro_scraper.js](./maro_scraper.js) hineinkopieren, DEINUSERNAME und DEINPASSWORT ersetzen und als maro_scraper.js abspeichern.
- /config/www/browserless<br>
  Hier legen Script und die Automation die .json-Dateien mit Wasserverbrauchswerten aktuell und Basis (Beispiel siehe [wasserverbrauch_aktuell.json](./wasserverbrauch_aktuell.json)). 

Mit z. B. dem Terminal in das Verzeichnis /config/scripts navigieren und die Datei browserless_scraper.sh ausführbar machen:  
cd /config/scripts  
chmod +x ./browserless_scraper.sh  

Einstellungen>Automationen & Szenen>Scripts>Skript erstellen, in den YAML Modus wechseln und den Inhalt aus der Datei 
[Maro Wasserverbrauch nach auffuellen.yaml](./Maro Wasserverbrauch nach auffuellen.yaml) hineinkopieren und abspeichern unter dem Namen Maro Wasserverbrauch nach auffuellen. Entität-ID sollte dann script.maro_wasserverbrauch_nach_auffuellen sein. Dieses Script berechnet den Grenzwert aus aktuellem "Wasserverbrauch gesamt" + Delta. Ein neuer Wert für Delta wird erst nach (!) Aufruf des Scripts berücksichtigt.   

Einstellungen>Automationen & Szenen>Automationen>Automation erstellen, in den YAML Modus wechseln und den Inhalt aus der Datei 
[Maro Wasserverbrauch Nachricht.yaml](./Maro Wasserverbrauch Nachricht.yaml) hineinkopieren und abspeichern unter dem Namen Maro Wasserverbrauch Nachricht. Entität-ID sollte dann automation.maro_wasserverbrauch_nachricht sein.   
In der Automation den Auslöser „Sobald“ an die eigenen Erfordernisse anpassen. Die von mir gesetzten Zeiten/Tage sind vor meinen üblichen Bezugszeiten.  
Abschließend noch den Schritt „Send a notification with signal“ an die eigenen Anforderungen anpassen (z. B. anderer Messenger oder LED an Voice PE einschalten oder oder oder…).   

Testen: Das Script ausführen und den Trace prüfen. Wenn alles geklappt hat, sollte in /config/www/browserless eine Datei maro_wasserverbrauch_grenzwert.json mit dem aktuellen "Wasserverbrauch gesamt" angelegt sein. Optional sollte der Wert plus Delta auf den Dashboard in der neuen Entitäten-Kachel angezeigt sein. 
  Wenn das Script funktioniert, die Automation testen. Wenn die ebenfalls funktioniert, sollte in dem o. g. Verzeichnis die Datei maro_wasserverbrauch_aktuell.json mit dem aktuellen "Wasserverbrauch gesamt" angelegt sein, ebenso optional sichtbar in der Entitäten-Kachel auf dem Dashboard.
## Fehlersuche
Fehleranalyse bei der Ausführung der maro_scraper.js mit browserless ist unter [Installation der browserless App](#Installation der browserless App in Home Assistant und ein erster Test) beschrieben.
  Schreibfehler bei Helper, Script, Automation, Verzeichnissen und Dateinamen sollten einfach durch Analyse der Traces des Scripts und der Automation zu analysieren und beheben sein.
  Wenn es bei der Ausführung der maro_scraper.js mit browserless ein 60s Timeout gibt, zunächst maro_scraper.js wie in liegt [Installation der browserless App](#Installation der browserless App in Home Assistant und ein erster Test) in der browserless App testen. Sicherheitshalber auch die Maro Webseite über einen Browser aufrufen. Wenn das alles funktioniert, liegt es an dem Aufruf der maro_scraper.js durch ein shell_command. Die Laufzeit dafür ist seitens Home Assistant auf 60s begrenzt und kann nicht geändert werden. Mein Home Assistant läuft in einer VMWare mit 4 GB RAM auf einem älteren Mac mini M1 und die Laufzeit für das gesamte Script bzw. die Aktion beträgt um die 10s. Weniger leistungsfähige Hardware oder langsame Internet-Verbindung könnte dann die Ursache sein. Weitere Informationen dazu bekommt man im Home Assistant über Einstellungen>System>Hardware.
