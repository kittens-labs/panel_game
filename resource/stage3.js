stage_matrix = [
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,1,1,1,0,1,0,0,],
[0,1,0,1,0,2,1,0,],
[0,1,1,3,1,1,0,0,],
[0,1,0,1,1,1,0,0,],
[0,1,0,0,0,0,0,0,],
]
window.panelLib= window.panelLib|| {};
window.panelLib.stage_matrix = stage_matrix; 

if(window.panelMainLib.isJP()){
    window.panelMainLib.message("ここまでくれば大丈夫", 10,60);
    window.panelMainLib.message("チュートリアルの", 10,100);
    window.panelMainLib.message("残りのステージを", 10,140);
    window.panelMainLib.message("お楽しみください", 10,180);
    

}else{
    window.panelMainLib.message("You've made it", 10,60);
    window.panelMainLib.message("this far—you're", 10,100);
     window.panelMainLib.message("good to go.", 10,140);
    window.panelMainLib.message("Enjoy the rest of", 10,180);
    window.panelMainLib.message("the tutorial stages.", 10,220);
}
