stage_matrix = [
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,1,1,0,0,0,],
]
window.panelLib= window.panelLib|| {};
window.panelLib.stage_matrix = stage_matrix; 

if(window.panelMainLib.isJP()){
    window.panelMainLib.message("パネルをタッチして", 10,60);
    window.panelMainLib.message("連鎖して消すゲーム!", 10,100);
    window.panelMainLib.message("開始したいパネルを", 10,180);
    window.panelMainLib.message("タッチしスワイプ", 10,220);

    window.panelMainLib.message("※マウスはクリック", 10,300);
    window.panelMainLib.message("をすぐ離してOK", 10,340);

    window.panelMainLib.message("実際にやってみて！", 10,420);
}else{
    window.panelMainLib.message("Touch panels to chain", 10,60);
    window.panelMainLib.message("and clear them!", 10,100);
    window.panelMainLib.message("Touch the panel", 10,180);
    window.panelMainLib.message("to start with and swipe.", 10,220);

    window.panelMainLib.message("*For mouse, click and", 10,300);
    window.panelMainLib.message("release immediately.", 10,340);

    window.panelMainLib.message("Try it out!", 10,420);
}
