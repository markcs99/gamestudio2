package sk.tuke.gamestudio.server.webservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sk.tuke.gamestudio.client.game.minesweeper.core.Field;

@RestController
@RequestMapping("/api/mines")
public class MinesWebServiceREST {
    private Field field;

    // http://localhost:8080/api/mines/new?rows=4&cols=4&mines=4
    @GetMapping("/new")
    public Field getTopScores(@RequestParam int rows, @RequestParam int cols, @RequestParam int mines) {
        this.field = new Field(rows, cols, mines);
        return this.field;
    }

    // http://localhost:8080/api/mines/open
    @GetMapping("/open")
    public Field openTile(@RequestParam int row, @RequestParam int col) {
        this.field.openTile(row, col);
        return this.field;
    }

    // http://localhost:8080/api/mines/mark
    @GetMapping("/mark")
    public Field markTile(@RequestParam int row, @RequestParam int col) {
        this.field.markTile(row, col);
        return this.field;
    }
}
