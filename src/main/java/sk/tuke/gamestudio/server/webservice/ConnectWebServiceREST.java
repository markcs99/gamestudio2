package sk.tuke.gamestudio.server.webservice;

import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.client.game.connect.core.Field;

@RestController
@RequestMapping("/api/connect")
public class ConnectWebServiceREST {
    private Field field;

    // http://localhost:8080/api/connect/new?rows=4&cols=4
    @GetMapping("/new")
    public Field getTopScores(@RequestParam int rows, @RequestParam int cols) {
        this.field = new Field(rows, cols);
        return this.field;
    }

    // http://localhost:8080/api/connect/move
    @GetMapping("/move")
    public Field moveTile(@RequestParam int col) {
        this.field.makeMove( col);
        return this.field;
    }

//    // http://localhost:8080/api/mines/mark
//    @GetMapping("/mark")
//    public Field markTile(@RequestParam int row, @RequestParam int col) {
//        this.field.markTile(row, col);
//        return this.field;
//    }
}