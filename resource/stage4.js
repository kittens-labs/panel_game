stage_matrix = [
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,1,1,1,1,0,0,],
[0,0,1,1,1,1,0,0,],
[0,0,1,2,1,1,0,0,],
[0,1,1,1,1,2,1,0,],
[0,0,0,0,0,0,0,0,],
]
window.panelLib= window.panelLib|| {};
window.panelLib.stage_matrix = stage_matrix; 

if(window.panelMainLib.isJP()){
    window.panelMainLib.message("素晴らしい！", 10,60);
    window.panelMainLib.message("ルールはこれだけ！", 10,100);
    window.panelMainLib.message("数字は最大９まであるよ", 10,180);
    window.panelMainLib.message("レベルを上げて挑戦だ！", 10,220);

}else{

}
