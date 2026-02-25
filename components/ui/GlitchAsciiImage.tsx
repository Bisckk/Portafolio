"use client";

import { useRef } from "react";
import Image from "next/image";

// ── ASCII art of Bismarck's profile ──
const ASCII_ART = `                                                                                            ..                                                            
                                                                                        . .                          +.                                   
                                                                                 :-   :-=. .:.-.                      =                                   
                                                                    +             .::.-. .:.  : .   .-:     .         .-                                  
                                                                  :-    ..==::-   :%.::.         :: :::.    :           =                                 
                                                       :         .:          ==..**=%*::    :  . +=+:-++--:-:           .-                                
                                                     .  :  .           .    **+#%%**#+:..::..=:**=++=+-:--=::  .:       ++                                
                                                    -      -:=**%##=-=-:..-***#*# +#+=:+.-:=+*+++++=++-:.*- :::       .**-                                
                                                   :    .:=++*#+***=:....+++##*+*+#==%*+--++*#***++#===-.     ....   .***.                                
                                                  :  -:=+::=::-*=::.:..+**#*%*=#*%#*#****###+++*-*+-+-=... : : . .:*#:+*+.  =                             
                                                .**.*:+.---=:=--=::+:++*###%***+#**+#*++***#%%:+#*=*=+*=. :.-=++**##+**=     :.                           
                                             :.=#---:#*:-=*+=-=::::==+#+#####**%%**+*###*#*#*#%##*%#*=+---=*:---=*#*=+:.:.   =                            
                                       .   .  #*-:.--%:=+*++*###*+%=*##*####%%#%*#++*+#%###%%+%#######**+-++::=+-==+:..=-.-:+:-    ..                     
                                        .   +#=+*-=%##%#**+=+===+=*%##%##%#%###*+*+####**%#####%%*+%****=*:.:-=-:::.::-:-- -+.  .- .                      
                                   .    -* -+==*#*##*####%#**#*+=+*%##%#%##**=-   .#.#%%#%%#%%%**#-#*+*+-+=::=*-:*...::.=--==---+  .                      
                                     .  -+**#+=*%%#**+##**##%%#%%%%%#%##+%-*-:.=.=.# *#%%#%%%%#%%+*#%=*+-.=-+--+:-:-:==++=:.  .   ::+-                    
                      :           .   -=-#+#*+**#*+**##%%%%%%%###*#%*+*:%+:++++#==#%**+ #%#*+###%#*#%-=#*:=-::::--::.:::...::. .. . ...:.                 
                   .                *%=*#+#**#+*-+-*** .%--+.=**+++#-*-=##+*#*#*%*#%%%%+=#%%*#-=:+*++-++-++-*:-::.:::*. :..:. .. .: :..                   
                  +-              -*+-##*+*+**++=..#* ==:*=+=*%****=#==*+=***-=:=*#**==+#%##+::+*:-*- .:-:=+=*::.:-....:..... . .  . -                    
                  #+           *+**:*#+*+++++*::.-##.-#=%#**+*+++#*+=%***#*+=***=--=%*+=-=##*+-=.:-=+=:::.:--:..:.-++ ...: . .*      .                    
                 .#            .*:=#+++++*+:::#. .#%-=%%:+%%%%***-*#*#*#**=-#*====#=-**=**+#**- .. :.::+--.=++#+-..:...   .:.::...+.       -              
                .:*%:.         -=-++**+*+--   =*#*%#+#+#*##*%%%%%%##%%%#+=+*+*-+==++-+-+++#%.+.-.. = .==:.:*+=::- .: ..... ..:  ....                      
               .  :*#..  .    :.*+-*+++--..=:=**#%%--%#+#-#%#%#%%%%%###*=*+==-:=++-*##+=+==%==:: .::-+ +:. .- .- :    .... ...:.    .                     
                 .+++*-   .  .  +=+++-+====%#*##*##+*=+**#%*%%#%%%#+*#--*-:---=.:*==:++:-***+#: .:.: ..=**. ..:-... .     . --:: ..  . .       .:         
                 -:#=*-=:..... ==+==+=+*#*##%%%#%#%%##*******#%%=-.=-:=:.::-==+=+=:=====#*#*-=.:  ... :-:+==.   ...       ..-.:...             =          
                  :##*:+=-*-+%+%++++*#%*#*%%%%%%=#%%*#*#+#**::-:+*=:::-==+=-==++++*%+-==*#*=--::::..: ....:=*+- .:..       :..:::.        .  .            
                  :=.*+:##*#**+#%**#%%%%%%%%%%%%*%+#*-#**%%%###*.+-+***#*#*++++***++*+=+#+++-=+:...... :. -=.:+-.:     .  .:  :::..     . .:..            
                   ++:-+*#**=+%%####*#%%%%%%%%#%*-%##%%:%-:*#.:-.**#*######**#*#**#*++%+=+--::.. . .:...  : . :**=:    .... ::   ..    .  . .             
                    .+=++++#=*#%##*#*#%%%%%#%#=.==*#%*##%%#+.#=-=**########%#######*-:*  %  .    . ..  ..    :  .  :..:   -=:   *...                      
             .        =*******+%###*%%#%%###%#:=.++####*#.#%.:.=*#%%###%%##%#%%:.::.. .                   :       ..   .    .    . ..       .             
                    -*-----###*%##*#+%%%#%%#*+*. .+==*.%%=-..#%*####%%%%##%%%%+:. =#                             .    .       .                           
                    .-   -**+**%##*#*%%%*+**#=**-.#+-*:+++#:=#*****##%%%%#%*#***-@    ....                                       ..      .                
                 . ..*: .=*+**#*%%*%+#%##+=##=  .:.=*.:+**#-#*%%%%#%###%##      -:.  ..                                             .    .                
                   .: .++#+***=-*#+*=#%%#-+-#+- -. =++#*:**#**#%%%##%     =*--::.    ==..                                                                 
         *         -..-++*****%+++-*-=##*#: :-#..=::=:=*=######%   -%%###*==:.. .+.                     ..::.                                             
          *       . :  *-####**=*=**:-**===.. ::. .##:=:#*%   :..:---==-:-:..         ..              .:---++=.                                           
          =#. : .   :.-*####**+*+=+---=+.:* . :. ...:    .##*%##%##%###*++--=-====:+ ..              ..::===+: ::.          ...                           
           :**:. .:-+**###%%##%#**+=+:-:.:.           *#++*###%#%%%#%%#%#***+*+==--:: .             ..::++#.% +*+-:           .                           
            -+.:-=+++=+*+#%#*%%###*++-:.::        ---+*#*###*#%%####%#%#%#####*++==:: ......      ..:::-:.*: :***=+-.                 :                   
           ==: .:---+***#####%%%##*#*=:        .:--.=*:**#######%#%#%%%%##%###***+++-:  ...   .....::::-.=:  *#*++==-:                :=                  
            *:+. -..:=+*#**#%%%#%##*####*=.   :=**:-+==+**###%%#%#%%##%#%#####*+#+++=-:. .....::....:::-::  **#%**+=-..               :*                  
            .*+=:-=++*#*###%%%%%#%#*:    +**##+*#+-=+-*+**#*########%%#%%#%###+#=*==:::..  .:........:-- . =*%%+=+*=:                   .                 
              .==:-++**###%###%%##:        =*####**++-+***####*####%###%#####=+*==+=---:::::  .......  ::=*#*=-:.:::.   .             . -                 
               *++-++*###########+   .-+#=. =++++****+*=*#*#**###*#########*#*+**++==-==:=::::......   .:*#-.     .                                       
            ::*####***+++*#######=  .=*%%#**#=::=****+:***#**#***#*#**#####**+++=+++++====--:....     ..:-:      .:                                       
          .-*###++*######%%%##**=# ::+*%%%%*. --+###*#***+*******##**#*******+=+--+=-=:-:-:.:...               .             ...                          
          -#*#-.:.+#**#%##*****=-*- -+#%#+:    :*%%##*****#**#*###***+****++=*+===+=+===---:::.... ..:.:.:..::=:.           . .                           
         +++.    -*+* =+*#**#*==:.+-++##=..   .+#%#%###***+#*+*###***#***=+++*++==++-+==:=---:.:.::::-:=-=::=:::            ...:                          
        .=+     .+  .-*********-++=*=**#-.  .:+-:+#*##*+**+**+*#**#****===+++-==*+++-==+:-+:::-----=--:-------.:          . .:..                          
          .     =    =-*########*:*+*+##+..:*#*+=*+*+*+=***#*####**#=++=-+-=++++=--+:+=====-=+*++==:::-=-+-+=+:..: ..      .....                          
               * .  -+**#**####=+==+*#*#%#*###%#*##-=+*++***######**====+++++++*+-++=++==-=*+=+==:::.--=+*-.                ....                          
              :.   :#########*+**%#*:*##**####***=+*-++=++*#####**+=----*=+++=*+=**++=++++=+=--:.....::.                .... ...                          
                  :++*#####**##%**++..:*########+**+-=+++.=*#****-+=--++=+++**=**++++++=++==+=-..                        ......                           
                 :++*##*****++*++*%-:.. .*+-+*+#***--.==:==+*#**++-=+=*#**.++*=++++++*+===+=::.          .. .            .  ...                           
                 .= .+=+=+++*#=**=#*-. .    ...:...   .-:=+#+++-=-=+*+*=+++***+*+**++=++++===..   ..--::.....              ...                            
                  ... ==:++*+*++#%*=:: -:    ...       -+=***+--:-*++**+=+*:+-*++++=+++-=-=........:::.....                 ..                            
                  .: ++:*#*#*=**=*+*++: :...  ::.      :-=*+*--:-+++===+++*+=+==+==+=+==-::............                ..  ...                            
                  - .+*#***#***=+#+=*+- - +. . ::...   .-==++-==-=======-===++=+==++==-:-:.....                            ..                             
                =--**=+.=#####**+**==--:..:    .--:.::.:---:-=-+==---::-=-==-+=+===-=:--:....... .                       . .                              
                .  -+.-=#****++**=*+=---. .-.   ==--:::---::::-=:-:...:::=-------:=:-:::::.:..........                    ..                              
                ....-=***-+.+++**=+-**-:*    .  :====-=====-:::..... ...:::-:::--:--:::---::::::--::.....:.              .                                
                ...-.  :..===*+#*=++**=#... . .  ++++==-=-=-::....     .......:::::::::----=---===*: .:-.:.                                               
                        --+**##*+=**#%=+=.:-. .. +++*+++===+-=-...           . ......:::. :---=-+.:. :.::.         . ..                                   
                       .==+*#***#==##+#+=:-=..   +++++++-=+=+=-::..                  .. ..:...::.-.: .  .          . ..                                   
                      +===+*++==--#*#+*#+-:---   +++*+++++++==+=-.:..                     ....  ...                  ..                                   
                    .+:*::---*##+#******+:=-=-.  -+++*++*==++=+----... .  .                                                                               
                     #:.   .- =#*#*+###+--*+-=:  :+*+*+*+++=-===--:.......                                                                                
                   +.++*==::++=#***#**#*+#*#+-.. .+++*++++++=-=--::::..... ... ..                                                                         
                      .-=====+++***++++=****=:...:+*#**=+=+-==--=::::::..........                                                                         
                           :+:.=.:+**==++**=::.:::+*+*++==-=-==:---:::-:::=::::::.. ..                                                                    
                         :.+*- .-.:+**+*++=-=--=:=+**+++++===-=:=:=-:-----==-==::-....                                                                    
                           #**-. ..-+++===::=-+=-=****++=+--=--=---:=:--==--++*=--:.: .                                                                   
                            ***+-=+++=-:..:--.+-:+***+++==++==-==-=----+++**++==---.:.                                                                    
                             .:.:.::..:=......-.:++***+====:=-=:----===+++#**+--::.:...                                                                   
                               .   .  :..... ...:+***+===-=====--==--=-==++-=-.-:.:...                                                                    
                            ::          ..: .   +*****+===-+---+=-========--:=:....: .                                                                    
                          :-..             ...  *#***++==-----=---==-==+----::-...... .                                                                   
                         -.:. .                 *****++=-=----=+====-====--:::::...                                                                       
                        -.:.    .              =++**+++=====-::=--=-=+==-:--.:....                                                                        
                        :.-....               -=+++++++=.----===:-:--===:----::...                                                                        
                     .:.-:.:..  ..           :=+===---=----=-+=+-+---:-:--::-::-..                                                                        
                   :......:...   ..        -+ +++===-----==--==+======:-:---=:::. .                                                                       
                 .:.:..:. :.  ..          :++  *=+===--=-====-=-=+=-:----::::::.:.                                                                        
                .:::.:.  . ...  . ..      .=++= ++++======:-======:--:-:-::::..                                                                           
                =.:::.. .   ..  .. .    .  -=**= +*+===+=====-=-=--------:..:...                                                                          
               =::-::.... .    ..    .   .   -++= .++==+==+=-=----:-::.:::....                                                                            
              --::.......    .   .      .      -+=.*-+++++===-::.::::::::..:...                                                                           
            ::.:.:..       .           . . .   . .=:-.++++===---:::.:::::.....                                                                            
         :::...        ..   .                    . .-::=++++=:::::::::.::.....                                                                            
        :.:.. ...    ..  .                           .: :+===-::.:.:.:-.....                                                                              
       ........     . ..  .  . .                        . .-=--::.:-:.-:...                  .                                                            
        .    .       .  .. .        .. .            .  .  %-::::----::::....               ...          %                                                 
    . ...                                           .           .-====--:...            ...:.. .       #                                                  
 . :.:..       .                                           %        +-==-::..       ....::::::..     %-                                                   
:....                            . .                    .              .+=-:.   ....::.:-=-:::--::                                                        
.                                     .:  :                        .       ..    ..::=--=+-+==                                                            
.                                                                              ...::====+++                                                               
            .                                                  %                  --==+            .                                                      `;

export function GlitchAsciiImage() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="glitch-wrap">
            <style jsx>{`
                /* ═══ Container ═══ */
                .glitch-wrap {
                    position: relative;
                    width: 100%;
                    max-width: 380px;
                    aspect-ratio: 3 / 4;
                    cursor: crosshair;
                    overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px));
                }

                /* ═══ Border ═══ */
                .glitch-wrap::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border: 1px solid rgba(204, 34, 0, 0.2);
                    clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px));
                    z-index: 25;
                    pointer-events: none;
                    transition: border-color 0.3s ease;
                }
                .glitch-wrap:hover::before {
                    border-color: rgba(204, 34, 0, 0.7);
                }

                /* ═══ Corner markers ═══ */
                .corner-tl, .corner-br {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    z-index: 30;
                    pointer-events: none;
                }
                .corner-tl { top: 0; left: 0; border-top: 2px solid #CC2200; border-left: 2px solid #CC2200; }
                .corner-br { bottom: 0; right: 0; border-bottom: 2px solid #CC2200; border-right: 2px solid #CC2200; }

                /* ═══ Main photo ═══ */
                .photo-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    transition: opacity 0.25s ease;
                }
                .glitch-wrap:hover .photo-layer {
                    opacity: 0;
                }

                /* ═══ ASCII background — always behind the photo ═══ */
                .ascii-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: #050505;
                    overflow: hidden;
                }
                .ascii-text {
                    font-family: 'Courier New', 'Lucida Console', monospace;
                    font-size: 10px;
                    line-height: 1.05;
                    color: #CC2200;
                    white-space: pre;
                    letter-spacing: -0.15px;
                    position: absolute;
                    /* Adjust top and left percentages to move the image. 
                       50% is dead center. Decrease to move up/left, increase to move down/right.
                       E.g., top: 48%; left: 49%; */
                    top: 54%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.42, 0.45);
                    text-shadow: 0 0 3px rgba(204, 34, 0, 0.35);
                    user-select: none;
                    opacity: 0.9;
                }
                /* Scanlines */
                .ascii-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 1px,
                        rgba(0, 0, 0, 0.1) 1px,
                        rgba(0, 0, 0, 0.1) 2px
                    );
                    z-index: 2;
                    pointer-events: none;
                }

                /* ═══ Hover Fade Wrapper ═══ */
                .photo-fade-wrapper {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    /* To prevent scale from clipping if not desired, keep overflow visible */
                }
                .glitch-wrap:hover .photo-fade-wrapper {
                    opacity: 0;
                    filter: blur(10px) brightness(0.5);
                    transform: scale(1.05);
                }

                /* ═══ Photo RGB Split & Glitch Reveal ═══ */
                .photo-layer {
                    animation: photoGlitchLayer 5s infinite;
                    transform-origin: center;
                    position: absolute;
                    inset: 0;
                }
                
                /* Create RGB split copies of the photo using pseudo-elements */
                .photo-layer::before,
                .photo-layer::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: url('/individual.png') no-repeat center center;
                    background-size: cover;
                    opacity: 0;
                    z-index: 10;
                    pointer-events: none;
                }

                .photo-layer::before {
                    /* Red/Magenta channel */
                    filter: sepia(1) hue-rotate(-50deg) saturate(300%) contrast(1.5);
                    mix-blend-mode: screen; 
                    animation: rgbGlitchRed 5s infinite;
                }

                .photo-layer::after {
                    /* Cyan/Blue channel */
                    filter: sepia(1) hue-rotate(140deg) saturate(300%) contrast(1.5);
                    mix-blend-mode: screen; 
                    animation: rgbGlitchCyan 5s infinite;
                }

                @keyframes photoGlitchLayer {
                    0%, 100% { opacity: 1; transform: translate(0); }
                    
                    /* Glitch 1: Instant blackout to reveal Red ASCII */
                    10% { opacity: 1; }
                    10.2% { opacity: 0; }
                    11.5% { opacity: 0; }
                    11.8% { opacity: 1; }

                    /* Glitch 2: Base layer tear and opacity drop */
                    30% { opacity: 1; transform: translate(0); clip-path: inset(0 0 0 0); }
                    30.2% { opacity: 0.5; transform: translate(-5px, 0); clip-path: inset(60% 0 30% 0); }
                    31.5% { opacity: 0.5; transform: translate(5px, 0); clip-path: inset(60% 0 30% 0); }
                    31.8% { opacity: 1; transform: translate(0); clip-path: inset(0 0 0 0); }

                    /* Glitch 3: Fast stutter */
                    50% { opacity: 1; }
                    50.2% { opacity: 0; }
                    50.6% { opacity: 1; }
                    51% { opacity: 0; }
                    51.4% { opacity: 1; }

                    /* Glitch 4: Full displacement */
                    70% { opacity: 1; transform: translate(0); clip-path: inset(0 0 0 0); }
                    70.2% { opacity: 0.3; transform: translate(15px, 0); clip-path: inset(20% 0 20% 0); }
                    71.2% { opacity: 0.8; transform: translate(-10px, 0); clip-path: inset(20% 0 20% 0); }
                    71.5% { opacity: 1; transform: translate(0); clip-path: inset(0 0 0 0); }
                }

                @keyframes rgbGlitchRed {
                    0%, 100% { opacity: 0; clip-path: inset(0 0 0 0); transform: translate(0); }
                    
                    10% { opacity: 1; clip-path: inset(20% 0 70% 0); transform: translate(-12px, 0); }
                    11.8% { opacity: 0; }
                    
                    30% { opacity: 1; clip-path: inset(60% 0 30% 0); transform: translate(15px, 0); }
                    31.8% { opacity: 0; }

                    50% { opacity: 1; clip-path: inset(40% 0 40% 0); transform: translate(-15px, 0); }
                    51.4% { opacity: 0; }

                    70% { opacity: 1; clip-path: inset(80% 0 10% 0); transform: translate(10px, 0); }
                    71.5% { opacity: 0; }
                }

                @keyframes rgbGlitchCyan {
                    0%, 100% { opacity: 0; clip-path: inset(0 0 0 0); transform: translate(0); }
                    
                    10% { opacity: 1; clip-path: inset(20% 0 70% 0); transform: translate(12px, 0); }
                    11.8% { opacity: 0; }

                    30% { opacity: 1; clip-path: inset(60% 0 30% 0); transform: translate(-15px, 0); }
                    31.8% { opacity: 0; }

                    50% { opacity: 1; clip-path: inset(40% 0 40% 0); transform: translate(15px, 0); }
                    51.4% { opacity: 0; }

                    70% { opacity: 1; clip-path: inset(80% 0 10% 0); transform: translate(-10px, 0); }
                    71.5% { opacity: 0; }
                }

                /* Hover states handled by .photo-fade-wrapper now */

                /* ═══ CRT vignette ═══ */
                .crt {
                    position: absolute;
                    inset: 0;
                    z-index: 20;
                    pointer-events: none;
                    background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%);
                }

                /* ═══ HUD labels ═══ */
                .lbl {
                    position: absolute;
                    font-family: 'Space Mono', 'Courier New', monospace;
                    font-size: 0.55rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    z-index: 28;
                    pointer-events: none;
                    transition: all 0.3s ease;
                }
                .lbl-file {
                    bottom: 12px; left: 14px;
                    color: rgba(204, 34, 0, 0.45);
                }
                .lbl-status {
                    top: 12px; right: 14px;
                    color: rgba(204, 34, 0, 0.45);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .lbl-hover {
                    bottom: 12px; right: 14px;
                    color: rgba(204, 34, 0, 0.25);
                    font-size: 0.5rem;
                    letter-spacing: 0.15em;
                }
                .glitch-wrap:hover .lbl-file,
                .glitch-wrap:hover .lbl-status {
                    color: rgba(204, 34, 0, 0.9);
                    text-shadow: 0 0 8px rgba(204, 34, 0, 0.5);
                }
                .glitch-wrap:hover .lbl-hover { opacity: 0; }

                .dot {
                    width: 6px; height: 6px;
                    background: #CC2200;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 4px #CC2200; }
                    50% { opacity: 0.3; box-shadow: 0 0 10px #CC2200; }
                }

                /* ── Hover ASCII flicker ── */
                .glitch-wrap:hover .ascii-bg .ascii-text {
                    animation: asciiPulse 0.08s infinite;
                }
                @keyframes asciiPulse {
                    0%   { opacity: 0.85; }
                    25%  { opacity: 0.95; }
                    50%  { opacity: 0.75; }
                    75%  { opacity: 1; }
                    100% { opacity: 0.88; }
                }
            `}</style>

            {/* Layer 1: ASCII art (always behind) */}
            <div className="ascii-bg">
                <pre className="ascii-text">{ASCII_ART}</pre>
            </div>

            {/* Layer 2: Photo with fade wrapper */}
            <div className="photo-fade-wrapper">
                <div className="photo-layer">
                    <Image
                        src="/individual.png"
                        alt="Bismarck Barrios — Frontend Developer"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 300px, 380px"
                        priority={false}
                    />
                </div>
            </div>

            {/* Layer 3: Glitch slices — CSS-only, always running */}
            {/* CRT vignette */}
            <div className="crt" />

            {/* Corners */}
            <div className="corner-tl" />
            <div className="corner-br" />

            {/* HUD */}
            <span className="lbl lbl-file">BK_PROFILE.raw</span>
            <span className="lbl lbl-status"><span className="dot" />ONLINE</span>
            <span className="lbl lbl-hover">[ HOVER ]</span>
        </div>
    );
}
