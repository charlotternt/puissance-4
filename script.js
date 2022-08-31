(function ($) {

  $(".config").click(function () {
    $(".config").remove();
    $("#jeu").css('visibility', "visible");
    $.fn.P4 = function () {
      $("#start").click(function () {
        const Y = $("#lig").val();
        const X = $("#col").val();
        $("#jeu").css('visibility', "hidden");
        $('#grid').ready(function () {
          const p4 = new Puissance4('#grid', Y, X);
          $('#restart').on('click', function () {
            $('#grid').empty();
            $('.fini').css('visibility', 'hidden');
            p4.drawGame();
          });
        });
      });

      class Puissance4 {
        constructor(plateau, Y, X) {
          this.Y = Y;
          this.X = X;
          this.plateau = plateau;
          this.color = 'red';
          this.drawGame();
          this.Game();
          this.verifGame();
          
        }
        
        drawGame() {
          const $jeu = $(this.plateau);

          for (let lig = 0; lig < this.Y; lig++) {
            const $lig = $('<div>').addClass('lig');
            for (let col = 0; col < this.X; col++) {
              const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lig", lig);
              $lig.append($col); 
            }
            $jeu.append($lig);
          }
        
        }

        Game() {
          const $jeu = $(this.plateau);
          const that = this;

          function lastcase(col) {
            const $cells = $(`.col[data-col='${col}']`);
            for(let i = $cells.length-1; i>=0; i--){
              const $cell = $($cells[i]);
              if($cell.hasClass('empty')){
                return $cell;
              }
            }
            return null;
          }

          $jeu.on('mouseenter', '.col.empty', function(){
            const $col = $(this).data('col');
            const $last = lastcase($col);
            if($last != null){
              $last.addClass(`p${that.color}`);
            }
          });

          $jeu.on('mouseleave', '.col', function () {
            $('.col').removeClass(`p${that.color}`);
          });
           $("#tour").css('visibility', "visible");
          $("#bulleTour").text(`C'est au tour du Joueur ${that.color}`);

          $jeu.on('click', '.col.empty', function(){
             const col = $(this).data('col');
             const $last = lastcase(col);
            $last.addClass(`${that.color}`).removeClass(`empty p${that.color}`).data('color', `${that.color}`);

            const gagner = that.verifGame($last.data('lig'), $last.data('col'));

            that.color = (that.color === 'red') ? 'yellow' : 'red';
            $("#bulleTour").text(`C'est au tour du Joueur ${that.color}`);

            if(gagner){
              $('.fini').css('visibility', 'visible');
              $('.content').prepend(`le Joueur ${gagner} a gagné.`);
              
            }
          });
        }
             
        verifGame(lig, col) {
          const that = this;

          function $getCell(y, x) {
            return $(`.col[data-lig='${y}'][data-col='${x}']`);
          }

          function verifDirection(direction) {
            let total = 0;
            let y = lig + direction.y;
            let x = col + direction.x;
            let $next = $getCell(y, x);
            while (y >= 0 && y < that.Y && x >= 0 && x < that.X && $next.data('color') === that.color) {
              total++;
              y += direction.y;
              x += direction.x;
              $next = $getCell(y, x);
            }
            return total;
          }

          function verifGame(directionY, directionX) {
            const total = 1 + verifDirection(directionY) + verifDirection(directionX);
            if (total >= 4) {
              return that.color;
            } else {
              return null;
            }
          }

          function verifHorizontal() {
            return verifGame({ y: 0, x: -1 }, { y: 0, x: 1 });
          }

          function verifVertical() {
            return verifGame({ y: -1, x: 0 }, { y: 1, x: 0 });
          }

          function verifDiag1() {
            return verifGame({ y: 1, x: 1 }, { y: -1, x: -1 });
          }

          function verifDiag2() {
            return verifGame({ y: 1, x: -1 }, { y: -1, x: 1 });
          }

          return verifHorizontal() || verifVertical() || verifDiag1() || verifDiag2();
        }
      }
    };
  
    $(".plugin").P4();
  });
}(jQuery));