class myinputclass {
    static test_input(id) {
        //since you are working with id
        var input = document.getElementById(id).value
        var pattern = /^[3-9]$/
        var matchpattern = /^[3-9]/
        if (!pattern.test(input)) {
            document.getElementById(id).value = input.match(matchpattern);
        }
    }

    static get_value(id) {
        return parseInt(document.getElementById(id).value)
    }

    static generate_game() {
        var no_rows = myinputclass.get_value('rows')
        var no_columns = myinputclass.get_value('columns')
        if (!isNaN(no_rows) & !isNaN(no_columns)) {
            document.body.innerHTML = ""
            //extremenly important!!!!
            window.myglobal_a = new mygameclass(no_rows, no_columns);//constant reference to the gameclass
        }
    }
}

class mygameclass {
    constructor(no_rows, no_columns) {
        this.win_condition = 3;
        if (Math.min(no_rows, no_columns) > 4) {
            this.win_condition = 4;
        }
        this.no_rows = no_rows;
        this.no_columns = no_columns;
        this.generate_divs();
        this.user = 0;
        this.image = ['url("./images/oks.png")', 'url("./images/iks.png")'];
        this.imageclickbutton = 'url("./images/go_back_click.png")';
        this.winner = {}
        this.winner[this.image[0]] = 'oks';
        this.winner[this.image[1]] = 'iks';
        this.emptyspace_tracker = this.no_rows * this.no_columns
    }

    generate_divs() {
        for (var ii = 0; ii < this.no_rows; ii++) {
            let divr = document.createElement("div");
            divr.className = 'row';
            divr.id = ii;
            divr.style.width = (30 * this.no_columns) + 'px';
            document.body.appendChild(divr);
            for (var jj = 0; jj < this.no_columns; jj++) {
                var divc = document.createElement("div");
                divc.className = 'column';
                divc.id = ii + '_' + jj
                divc.setAttribute("type", "button")
                divc.setAttribute("onclick", "window.myglobal_a.main_insert(id)")
                document.getElementById(ii).appendChild(divc);
            }
        }
        let divb = document.createElement("div");
        divb.id = 'return';
        divb.setAttribute("type", "button")
        divb.setAttribute("onclick", "window.myglobal_a.go_back(id)")
        document.body.appendChild(divb);
    }
    //not sure is it working
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    go_back(id) {
        document.getElementById(id).style.backgroundImage = this.imageclickbutton;
        this.sleep(100).then(() => {
            window.location.reload()
        })

    }


    //image overlapping
    mark_winning_combination(id_list) {
        for (var item of id_list) {
            document.getElementById(item).style.backgroundImage = document.getElementById(item).style.backgroundImage + ", url('./images/overlay.png')"
        }
    }

    check_win(id) {
        var flag;
        var rowidx = parseInt(id.match(/^\d/))
        var columnidx = parseInt(id.match(/\d$/))
        var image_to_check = document.getElementById(id).style.backgroundImage
        var res_h = this.check_h(rowidx, columnidx, image_to_check)
        var res_v = this.check_v(rowidx, columnidx, image_to_check)
        var res_D1 = this.check_D1(rowidx, columnidx, image_to_check)
        var res_D2 = this.check_D2(rowidx, columnidx, image_to_check)
        if (res_h[0] >= this.win_condition) {
            flag = 1
            this.mark_winning_combination(res_h[1])
        }
        if (res_v[0] >= this.win_condition) {
            flag = 1
            this.mark_winning_combination(res_v[1])
        }
        if (res_D1[0] >= this.win_condition) {
            flag = 1
            this.mark_winning_combination(res_D1[1])
        }
        if (res_D2[0] >= this.win_condition) {
            flag = 1
            this.mark_winning_combination(res_D2[1])
        }
        if (flag) {
            this.sleep(200).then(() => {
                if (!alert('User ' + this.winner[image_to_check] + ' has won.')) { this.new_game() }//there is an issue with alert in current version of firefox
            })

        } else if (this.emptyspace_tracker == 0) {
            this.sleep(200).then(() => {
                if (!alert('There is no winner.')) { this.new_game() }//issues with alert in new version of firefox
            })
        }
    }

    new_game() {
        document.body.innerHTML = ""
        //extremenly important!!!!
        window.myglobal_a = new mygameclass(this.no_rows, this.no_columns);
    }

    check_h(rowidx, columnidx, image_to_check) {

        var tmpc = columnidx;
        var tmpr = rowidx;
        var cnt = 1;
        var idlist = []
        idlist.push(tmpr + '_' + tmpc)
        while (tmpc > 0 & cnt <= this.win_condition & image_to_check == document.getElementById(tmpr + '_' + Math.max(tmpc - 1, 0)).style.backgroundImage) {
            cnt++
            tmpc--
            idlist.push(tmpr + '_' + tmpc)
        }
        var tmpc = columnidx;
        while (tmpc < this.no_columns - 1 & cnt <= this.win_condition & image_to_check == document.getElementById(tmpr + '_' + Math.min(tmpc + 1, this.no_columns - 1)).style.backgroundImage) {
            cnt++
            tmpc++
            idlist.push(tmpr + '_' + tmpc)
        }
        return [cnt, idlist]
    }

    check_v(rowidx, columnidx, image_to_check) {
        var tmpc = columnidx;
        var tmpr = rowidx;
        var cnt = 1;
        var idlist = []
        idlist.push(tmpr + '_' + tmpc)
        while (tmpr > 0 & cnt <= this.win_condition & image_to_check == document.getElementById(Math.max(tmpr - 1, 0) + '_' + tmpc).style.backgroundImage) {
            cnt++
            tmpr--
            idlist.push(tmpr + '_' + tmpc)
        }
        var tmpr = rowidx;
        while (tmpr < this.no_rows - 1 & cnt <= this.win_condition & image_to_check == document.getElementById(Math.min(tmpr + 1, this.no_rows - 1) + '_' + tmpc).style.backgroundImage) {
            cnt++
            tmpr++
            idlist.push(tmpr + '_' + tmpc)
        }
        return [cnt, idlist]
    }

    check_D1(rowidx, columnidx, image_to_check) {
        var tmpc = columnidx;
        var tmpr = rowidx;
        var cnt = 1;
        var idlist = []
        idlist.push(tmpr + '_' + tmpc)
        while (tmpc > 0 & tmpr > 0 & cnt <= this.win_condition & image_to_check == document.getElementById(Math.max(tmpr - 1, 0) + '_' + Math.max(tmpc - 1, 0)).style.backgroundImage) {
            cnt++
            tmpc--
            tmpr--
            idlist.push(tmpr + '_' + tmpc)
        }
        var tmpc = columnidx;
        var tmpr = rowidx;
        while (tmpc < this.no_columns - 1 & tmpr < this.no_rows - 1 & cnt <= this.win_condition & image_to_check == document.getElementById(Math.min(tmpr + 1, this.no_rows - 1) + '_' + Math.min(tmpc + 1, this.no_columns - 1)).style.backgroundImage) {
            cnt++
            tmpc++
            tmpr++
            idlist.push(tmpr + '_' + tmpc)
        }
        return [cnt, idlist]
    }

    check_D2(rowidx, columnidx, image_to_check) {
        var tmpc = columnidx;
        var tmpr = rowidx;
        var cnt = 1;
        var idlist = []
        idlist.push(tmpr + '_' + tmpc)
        while (tmpc > 0 & tmpr < this.no_rows - 1 & cnt <= this.win_condition & image_to_check == document.getElementById(Math.min(tmpr + 1, this.no_rows - 1) + '_' + Math.max(tmpc - 1, 0)).style.backgroundImage) {
            cnt++
            tmpc--
            tmpr++
            idlist.push(tmpr + '_' + tmpc)
        }
        var tmpc = columnidx;
        var tmpr = rowidx;
        while (tmpc < this.no_columns - 1 & tmpr > 0 & cnt <= this.win_condition & image_to_check == document.getElementById(Math.max(tmpr - 1, 0) + '_' + Math.min(tmpc + 1, this.no_columns - 1)).style.backgroundImage) {
            cnt++
            tmpc++
            tmpr--
            idlist.push(tmpr + '_' + tmpc)
        }
        return [cnt, idlist]
    }




    insert(element) {
        if (element.style.backgroundImage == '') {
            element.style.backgroundImage = this.image[this.user]
            this.user = (this.user + 1) % 2
            return 0
        } else {
            return 1
        }
    }


    main_insert(id) {
        this.emptyspace_tracker--
        var element = document.getElementById(id)
        let insert_finish = this.insert(element);
        if (insert_finish == 0) {
            this.check_win(id)
        }
    }
}