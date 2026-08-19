# Maro Model 1 Benachrichtigung über Wasserverbrauch mit Home Assistant
Ich nutze die Maro kein bis zwei Mal am Tag, pro Bezug verbrauche ich ca. 0,2 bis 0,3 L Wasser. Dadurch ist eine tägliche Routine wie z. B. Auffüllen des Wassertanks immer morgens für mich nicht sinnvoll. Entgegen statistischer Wahrscheinlichkeit erscheint die Information "Bitte Wasser nachfüllen" immer zur Unzeit. Da es von Maro kein API gibt, habe ich diesen Benachrichtigungsdienst für Home Assistant entwickelt.  

  Der Ablauf: nach Befüllen des Wassertanks starte ich manuell ein Home Assistant Script. Dies ruft über die browserless Chromium App die Maro Home Webseite auf, meldet sich mit meinem Account an, navigiert zur "Mein Model 1" Webseite und liest den Wert „Wasserverbrauch gesamt“ aus. Der Wert wird in eine Datei in einem Home Assistant Verzeichnis gespeichert und dann in einer numerischen Variable abgespeichert. Zu diesem Wert wird ein Delta-Wert addiert, das ergibt den Grenzwert.  
Zweimal täglich startet eine Automation mit dem gleichen Ablauf wie das Script und schreibt den aktuellen "Wasserverbrauch gesamt" in eine andere numerische Variable. Ein aktueller Wert größer als der Grenzwert löst eine Benachrichtigung aus.  
 
Beispiel: 
- Delta-Wert 0.8 L, „Wasserverbrauch gesamt“ bei Auffüllen 40 L, Grenzwert dann 40.8 L.
- Aktueller „Wasserverbrauch gesamt“ 40,4 L, keine Benachrichtigung.
- Aktueller „Wasserverbrauch gesamt“ 41,1 L, Benachrichtigung.
  
Grenzwert und Zeitpunkt der Überprüfung sind individuell konfigurierbar.
    
Die Vorgehensweise orientiert sich an [Scraping dynamic websites...](https://community.home-assistant.io/t/guide-scraping-dynamic-websites-with-browserless-multiscrape-v2-update/665676) von 2024 mit einigen Anpassungen/Erweiterungen von mir.

## Disclaimer
Ich bin privater Besitzer einer Maro Model 1. Dieses Repository habe ich für meinen eigenen Bedarf erstellt und ist in meiner Home Assistant Installation funktionsfähig. Gewährleistung und Haftung bei der Nutzung durch Dritte schließe ich aus.
## Support
Kein Support. Tips zur Selbsthilfe sind bei den einzelnen Schritten aufgeführt.
## Voraussetzungen
- Maro Home Zugangsdaten und Maro Model 1 in Maro Home eingebunden. 
- Home Assistant und eingerichteter [Benachrichtigungsdienst](https://www.home-assistant.io/integrations/#notifications). Alternativ kann Voice PE für Sprachausgabe verwendet oder sein LED Ring eingeschaltet werden.
- Ggf. Kenntnisse im Umgang mit dem Entwicklermodus des genutzten Browsers.
- Mindestens 2 Stunden Zeit einplanen.
## Voll-Backup von Home Assistant
Die Installation bewegt sich ausschließlich innerhalb von Home Assistant mit den üblichen Methoden. Dennoch empfehle ich vor Beginn der Installation ein Voll-Backup von Home Assistant zu erstellen und herunterzuladen.
## Installation der Browserless Chromium App
[Browserless Chromium](https://github.com/alexbelgium/hassio-addons/tree/master/browserless_chrome) aufrufen und dort den Anweisungen zur Installation der App in Home Assistant folgen. Nach der Installation die App starten und die Schalter für Watchdog und Automatische Updates aktivieren.  
  
  Falls der Start nicht funktioniert, die Protokolle der App und des Supervisors prüfen.
  
  War der Start erfolgreich, den Button "Benutzeroberfläche öffnen" betätigen, es öffnet sich die http Webseite DEINE-HA-IP:3000/docs/ oder localhost:3000/docs/. Damit war die Installation erfolgreich. 
  
  Falls der Aufruf der Webseite nicht funktioniert, wieder die Protokolle der App und des Supervisors prüfen. Weitere Fehlerursachen können Add-Ons im Browser oder Einstellungen im lokalen Netzwerk sein.

  Ohne lauffähige Browserless Chromium App funktioniert der weitere Ablauf nicht.
## Test des Auslesens
Das Javascript [maro_scraper.js](./maro_scraper.js) führt alle Schritte zum Auslesen durch. 

  In der Browserless Chromium App den Button "Benutzeroberfläche öffnen" betätigen und in der Url DEINE-HA-IP:3000/docs/ oder localhost:3000/docs/ den Teil /docs/ durch /debugger/ ersetzen und mit Enter bestätigen.  
    
  Oben in der Mitte auf das + Zeichen drücken, im Fenster links alles markieren und löschen. Den Inhalt der Datei [maro_scraper.js](./maro_scraper.js) über die Zwischenablage einfügen und DEINUSERNAME und DEINPASSWORT mit den Maro Home Zugangsdaten ersetzen. 
    
  Betätigen des roten Pfeils startet den Ablauf, der im Fenster rechts abgespielt wird:
  - Aufruf der Maro Home Webseite, Eingabe der E-Mail Adresse und betätigen des Weiter Buttons.
  - Eingabe des Kennworts und Betätigen des Anmelden Buttons.
  - Im "Angemeldet bleiben" Fenster den Button Nein betätigen.
  - Von der /dashboard Webseite auf die /my-maro Webseite navigieren.
  - Die dann heruntergeladene Datei enthält den "Wasserverbrauch gesamt".

  Zur Fehleranalyse ist es hilfreich, einen kostenfreien Account bei [browserless.io](www.browserless.io) anzulegen. Dann auf der linken Seite "Rest API Playground" auswählen, im Feld "Your Code here" wieder den Inhalt der Datei [maro_scraper.js](./maro_scraper.js) (mit geändertem DEINUSERNAME und DEINPASSWORT) einfügen und Run betätigen. Nun den Button Ask AI betätigen, den Inhalt der maro_scraper.js hineinkopieren. In der Maro Home auf die Seite gehen, bei der die maro_scraper.js gestoppt hat. Dort über den Entwicklungsmodus des Browsers die HTML in die Zwischenablage kopieren, ebenfalls in das Ask AI Fenster hineinkopieren. Abschließend noch eine Frage dazu stellen (z. B. why does the script stop at...) und die AI analysieren lassen.  
  Die AI kann die maro_scraper.js auch in eine Debug Version umwandeln. Die startet man wieder in der Rest API und gibt die Rückgabe wieder an die AI zur Analyse. 
  
## Weitere Anpassungen in Home Assistant
Unter Einstellungen>Geräte & Dienste>Helfer drei Entitäten für numerische Zahlenwert-Eingabe anlegen:
- input_number.maro_wasserverbrauch_grenzwert mit Minimalwert 0, Maximalwert 10000000, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.
- input_number.maro_wasserverbrauch_aktuell mit Minimalwert 0, Maximalwert 10000000, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.
- input_number.maro_wasserverbrauch_delta mit Minimalwert 0, Maximalwert 10, Typ Eingabefeld, Schrittweite 0,1, Maßeinheit L.  Unter Einstellungen>Werkzeuge>Zustände den Wert für input_number.maro_wasserverbrauch_delta auf 0.8 L setzen. Das kann später ggf. angepasst werden.

Optional: im Dashboard eine neue Entitäten-Kachel anlegen, in YAML bearbeiten und den Inhalt der Datei [Dashboard_Entities_Karte.yaml](./Dashboard_Entities_Karte.yaml) einfügen.  

Mit z. B. dem Studio Code Editor drei Verzeichnisse und zwei Dateien anlegen:
- /config/scripts anlegen<br>
Hier eine neue Datei erzeugen, den Inhalt der Datei [browserless_scraper.sh](./browserless_scraper.sh) hineinkopieren und als browserless_scraper.sh abspeichern.
- /config/js_scrapers anlegen<br>
Hier eine neue Datei erzeugen, den Inhalt der Datei [maro_scraper.js](./maro_scraper.js) hineinkopieren, DEINUSERNAME und DEINPASSWORT ersetzen und als maro_scraper.js abspeichern.
- /config/www/browserless anlegen<br>
  Hier legen Script und die Automation die .json-Dateien mit Wasserverbrauchswerten aktuell und Basis (Beispiel siehe [wasserverbrauch_aktuell.json](./wasserverbrauch_aktuell.json)). 

Mit z. B. dem Terminal in das Verzeichnis /config/scripts navigieren und die Datei browserless_scraper.sh ausführbar machen:  
cd /config/scripts  
chmod +x ./browserless_scraper.sh  

Einstellungen>Automationen & Szenen>Scripts>Skript erstellen, in den YAML Modus wechseln und den Inhalt aus der Datei 
[Maro Wasserverbrauch nach auffuellen.yaml](./Maro_Wasserverbrauch_nach_auffuellen.yaml) hineinkopieren und abspeichern unter dem Namen Maro Wasserverbrauch nach auffuellen. Entität-ID sollte dann script.maro_wasserverbrauch_nach_auffuellen sein. Dieses Script berechnet den Grenzwert aus aktuellem "Wasserverbrauch gesamt" + input_number.maro_wasserverbrauch_delta. Ein neuer Wert für input_number.maro_wasserverbrauch_delta wird erst nach (!) Aufruf des Scripts berücksichtigt.   

Einstellungen>Automationen & Szenen>Automationen>Automation erstellen, in den YAML Modus wechseln und den Inhalt aus der Datei 
[Maro Wasserverbrauch Nachricht.yaml](./Maro_Wasserverbrauch_Nachricht.yaml) hineinkopieren und abspeichern unter dem Namen Maro Wasserverbrauch Nachricht. Entität-ID sollte dann automation.maro_wasserverbrauch_nachricht sein.   
In der Automation den Auslöser „Sobald“ an die eigenen Erfordernisse anpassen. Die von mir gesetzten Zeiten/Tage sind vor meinen üblichen Bezugszeiten.  
Abschließend noch den Schritt „Send a notification with signal“ an die eigenen Anforderungen anpassen (z. B. anderer Messenger oder LED an Voice PE einschalten oder oder oder…).   

Testen: Das Script ausführen und den Trace prüfen. Schreibfehler bei Dateien, Entitäten oder in falschem Verzeichnis angelegte Dateien korrigieren (auch gleich in der Automation).   
Wenn alles geklappt hat, sollte in /config/www/browserless eine Datei maro_wasserverbrauch_grenzwert.json mit dem aktuellen "Wasserverbrauch gesamt" angelegt sein. Optional sollte der Wert plus Delta auf dem Dashboard in der neuen Entitäten-Kachel angezeigt sein. 
  Wenn das Script funktioniert, die Automation testen. Wenn die ebenfalls funktioniert, sollte in dem o. g. Verzeichnis die Datei maro_wasserverbrauch_aktuell.json mit dem aktuellen "Wasserverbrauch gesamt" angelegt sein, ebenso optional sichtbar in der Entitäten-Kachel auf dem Dashboard.
  
  Wenn das Script oder die Automation beim Schritt "shell_command: browserless_scraper" mit einem 60s Timeout abbrechen, zunächst prüfen, ob die Maro Webseite funktioniert. Danach prüfen, ob die Ausführung der maro_scraper.js wie in [Test des Auslesens](#<Test%20des%20Auslesens>) beschrieben funktioniert.
  
  Wenn das alles funktioniert, liegt es an dem Aufruf der maro_scraper.js durch ein shell_command. Die Laufzeit dafür ist seitens Home Assistant auf 60s begrenzt und kann nicht geändert werden. Mein Home Assistant läuft in einer VMWare mit 4 GB RAM auf einem älteren Mac mini M1 und die Laufzeit für das gesamte Script bzw. die Aktion beträgt um die 10s. Weniger leistungsfähige Hardware oder langsame Internet-Verbindung könnte dann die Ursache sein. Weitere Informationen dazu bekommt man im Home Assistant über Einstellungen>System>Hardware.
