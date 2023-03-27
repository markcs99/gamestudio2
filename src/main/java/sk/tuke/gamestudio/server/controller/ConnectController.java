package sk.tuke.gamestudio.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.gamestudio.client.game.connect.core.Field;
import sk.tuke.gamestudio.client.game.connect.core.Tile;
import sk.tuke.gamestudio.client.game.connect.core.GameState;
import sk.tuke.gamestudio.common.entity.Score;
import sk.tuke.gamestudio.common.service.ScoreService;

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/connect")
@Scope(WebApplicationContext.SCOPE_SESSION)
public class ConnectController {

    private Field field = null;
    private boolean marking = false;
    private int player= 1;

    @Autowired
    private ScoreService scoreService;

    @Autowired
    private UserController userController;

    // /connect
    @RequestMapping
    public String processUserInput(@RequestParam(required = false) Integer row,@RequestParam(required = false) Integer column){

        startOrUpdateGame(row,column);
        return "connect";
    }

    // /connect/chmode
    @RequestMapping("/chmode")
    public String changeMode(){
        changeGameMode();
        return "connect";
    }

    // /connect/new
    @RequestMapping("/new")
    public String newGame(){
        startNewGame();
        return "connect";
    }


    // /connect/asynch
    @RequestMapping("/asynch")
    public String loadInAsynchMode(){
        startOrUpdateGame(null,null);
        return "connectAsynch";

    }

    // /connect/json
    @RequestMapping(value="/json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Field processUserInputJson(@RequestParam(required = false) Integer row,@RequestParam(required = false) Integer column){
//        field.setJustFinished(startOrUpdateGame(row,column));
//        field.setMarking(marking);
        return field;
    }

    // /connect/jsonchmode
    @RequestMapping(value="/jsonchmode", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Field changeModeJson(){
        changeGameMode();
//        field.setJustFinished(false);
//        field.setMarking(marking);
        return field;
    }

    // /connect/jsonnew
    @RequestMapping(value="/jsonnew", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Field newGameJson(){
        startNewGame();
//        field.setJustFinished(false);
//        field.setMarking(marking);
        return field;
    }

    private boolean startOrUpdateGame(Integer row, Integer column){
        if(field==null){
            startNewGame();
        }

        boolean justFinished=false;

        if(row!=null && column!=null){

            GameState stateBeforeMove = field.getState();

            if(stateBeforeMove == GameState.PLAYING){
                    field.makeMove(column);
            }



            if(field.getState()!=GameState.PLAYING){
                justFinished=true;
                if(userController.isLogged()){
                    scoreService.addScore(new Score("connect",userController.getLoggedUser(),field.getScore(), new Date()));
                }
            }
        }

        return justFinished;

    }

    private void startNewGame(){
        field = new Field(9,9);
        marking = false;
        player = field.getCurrentPlayer();
    }

    private void changeGameMode(){
        if(field==null){
            startNewGame();
        }
        marking=!marking;
    }

    public  boolean isMarking(){
        return marking;
    }

    public String getCurrentTime(){
        return new Date().toString();
    }

    public List<Score> getTopScores(){
        return scoreService.getTopScores("connect");
    }

    public Tile[][] getFieldTiles() {
        if(field==null){
            return null;
        }else{
            return field.getTiles();
        }
    }

    public boolean isPlaying(){
        if(field==null){
            return false;
        }else{
            return (field.getState()== GameState.PLAYING);
        }
    }

    public String getHtmlField(){
        StringBuilder sb = new StringBuilder();
        sb.append("<table class='minefield'> \n");
        for (int row = 0; row < field.getRows(); row++) {
            sb.append("<tr>\n");
            for (int column = 0; column < field.getCols(); column++) {
                var tile = field.getTile(row, column);
                sb.append("<td class='" + getTileClass(tile) + "'>\n");
                if(field.getState()==GameState.PLAYING){
                    sb.append("<a href='/connect?row="+row+"&column="+column+"'>\n");
                    sb.append("<span>" + getTileText(tile) + "</span>");
                    sb.append("</a>\n");
                }else{
                    sb.append("<span>" + getTileText(tile) + "</span>");
                }
                sb.append("</td>\n");
            }
            sb.append("</tr>\n");
        }
        sb.append("</table>\n");
        return sb.toString();
    }


    public String getTileText(Tile tile) {
        switch (tile.getPlayer()) {
            case 1:
                return "1";
            case 2:
                return "2";
            case 0:
                return "0";
            default:
                throw new IllegalArgumentException("Unsupported tile state " + tile.getPlayer());
        }
    }

    public String getTileClass(Tile tile) {
        switch (tile.getPlayer()) {
            case 1:
                return "p1";
            case 2:
                return "p2";
            case 0:
                return "empty";
            default:
                throw new RuntimeException("Unexpected tile state");
        }
    }






}
