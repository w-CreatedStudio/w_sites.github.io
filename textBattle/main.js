let steps = 0;

let flag = 0;
let eneDefFlag = 0, playerDefFlag = 0;
let winFlag = 0;
let enemyTurn;
let random;
let player_st = { name: "Player", lv: 1, maxHP: 100, hp: 100, atk: 30, def: 20, xp: 0, upLevXP: 100 };
var i = 0, rockUpXp;
let enemy;
let slime = { name: "Slime", maxHP: 50, hp: this.maxHP, atk: 30, def: 10, xp: 40 };
let gobrin = { name: "Gobrin", maxHP: 80, hp: this.maxHP, atk: 40, def: 15, xp: 60 };
let bats = { name: "Bats", maxHP: 40, hp: this.maxHP, atk: 30, def: 5, xp: 30 };
let monsterTree = { name: "MonsterTree", maxHP: 90, hp: this.maxHP, atk: 50, def: 20, xp: 70 };


let eneArray = [slime, gobrin];

//---------- BUTTON ----------
//homeButton
function home() {
    flag = 0;
    let result = confirm('Do you want to clear texts?');
    if (result) {
        reset(1, 1, 1);
        let text = document.getElementById('black');
        text.innerHTML += "--- HOME ---";
    }

}
//statusButton
function status() {
    if (flag == 0) {
        reset(0, 0, 0);
        let text = document.getElementById('black');
        text.innerHTML += "<br>PlayerStatus...<br> Level: " + player_st.lv + ", HP: "
            + player_st.hp + ", ATK: " + player_st.atk + ", DEF: " + player_st.def
            + "<br>__You have " + player_st.xp + "xp."
            + "<br>__You need " + player_st.upLevXP + "xp to level up.";
        window.scrollTo(0, document.body.scrollHeight);
    }
}
//moveButton
async function move() {
    if (flag == 0) {
        reset(0, 1, 1);
        flag = 1;
        playerDefFlag = 0;
        let text = document.getElementById('black');
        text.innerHTML += "<br>Moving";
        window.scrollTo(0, document.body.scrollHeight);
        const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
        for (let i = 0; i < 3; i++) {
            text.innerHTML += ".";
            await setSleep(500)
        }
        flag = 0;
        random = Math.floor(Math.random() * 100);
        action(random);
    }
}
//helpButton
function help() {
    reset(0, 0, 0);
    let text = document.getElementById('green');
    text.innerHTML += "<br>home: To clear texts." +
        "<br>status: To show your status." +
        "<br>move: To go to next stage.";
}



//---------- ACTION ----------
function action(act_nun) {
    flag = 1;
    if (0 <= act_nun && act_nun <= 30) {
        let text = document.getElementById('black');
        text.innerHTML += "<br>Nothing happend...";
        window.scrollTo(0, document.body.scrollHeight);
        flag = 0;
    }
    if (31 <= act_nun && act_nun <= 60) {
        let text = document.getElementById('black');
        text.innerHTML += '<br>>> Enemy Encountered! <<';
        random = Math.floor(Math.random() * eneArray.length);
        enemy = eneArray[random];
        enemy.hp = enemy.maxHP;
        winFlag = 0;
        turnCount = 0;
        battle();
    }
    if (61 <= act_nun && act_nun <= 80) {
        let text = document.getElementById('black');
        text.innerHTML += "<br>Found a rest stop.";
        random = Math.floor(Math.random() * 40) + 10;
        heal(random, player_st.name);
        window.scrollTo(0, document.body.scrollHeight);
        flag = 0;
    }
    if (81 <= act_nun && act_nun <= 100) {
        let text = document.getElementById('black');
        text.innerHTML += "<br>Caught in a trap!";
        random = Math.floor(Math.random() * 45) + 5;
        damage(random, player_st);
        window.scrollTo(0, document.body.scrollHeight);
        flag = 0;
    }
    //flag = 0;
}

var turnCount = 0;
function battle() {
    if (flag == 1) {
        if (turnCount > 0 && enemyTurn == 1) {
            //-----------------------------------------
            //enemyTurn
            //-----------------------------------------
            random = Math.floor(Math.random() * 99) + 1;
            let text = document.getElementById('black');
            if (random <= 60) {
                text.innerHTML += "<br>" + enemy.name + " attacks you!";
                attack(enemy);
                text.innerHTML += "<br>Turn end...";
            } else if (61 <= random && random <= 95) {
                defense(enemy);
                text.innerHTML += "<br>Turn end...";
            } else if (random >= 96) {
                text.innerHTML += "<br>" + enemy.name + " escapes...";
                flag = 0;
            }

        }
        enemyTurn = 0;
        //-----------------------------------------
        //playerTurn
        //-----------------------------------------
        if (flag == 1) {
            let actionText = document.getElementById('black');
            actionText.innerHTML += "<br>Choose your action.<span id= 'actionButton'>"
                + '<br><button onClick="attack(player_st);">ATTACK</button>'
                + '<button onClick="defense(player_st);">DEFENSE</button>'
                + '<button onClick="escape();">ESCAPE</button></span>';
            showStatus();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
}


//-------- moveButton ---------
function attack(who) {
    if (flag == 1) {
        turnCount++;
        let atkDamage;
        if (who == player_st) {
            atkDamage = player_st.atk;
            if (eneDefFlag) {
                atkDamage -= enemy.def;
                eneDefFlag = 0;
            }
            damage(atkDamage, enemy);
        } else {
            atkDamage = enemy.atk;
            if (playerDefFlag) {
                atkDamage -= player_st.def;
                playerDefFlag = 0;
            }
            damage(atkDamage, player_st);
        }
        if (winFlag == 0 && who != enemy) {
            enemyTurn = 1;
            let text = document.getElementById('black');
            text.innerHTML += "<br>Turn end...";
            battle();
        }
    }
}
function defense(who) {
    if (flag == 1) {
        turnCount++;
        if (who == player_st) {
            playerDefFlag = 1;
        } else { eneDefFlag = 1; }
        let text = document.getElementById('black');
        text.innerHTML += "<br>" + who.name + " defensed.";
        enemyTurn = 1;
        if (who != enemy) {
            let text = document.getElementById('black');
            text.innerHTML += "<br>Turn end...";
            battle();
        }
    }
}
function escape() {
    if (flag == 1) {
        turnCount++;
        random = Math.floor(Math.random() * 100);
        let text = document.getElementById('black');
        if (random < 10) {
            text.innerHTML += "<br>You got away...";
            reset(0, 1, 1);
            flag = 0;
            turnCount = 0;
        } else {
            text.innerHTML += "<br>You couldn't escape.";
            enemyTurn = 1;
            text.innerHTML += "<br>Turn end...";
            battle();
        }
    }
}



function heal(addHP, who) {
    if (who == player_st.name) {
        let text = document.getElementById('black');
        text.innerHTML += "<br>You have recovered."
            + "<br>HP: " + player_st.hp;
        player_st.hp += addHP;
        if (player_st.hp > player_st.maxHP) { player_st.hp = player_st.maxHP; }
        text.innerHTML += " --> HP: " + player_st.hp;
    }
}
function damage(takeDamage, who) {
    let text = document.getElementById('black');
    text.innerHTML += "<br>" + who.name + " are damaged."
        + "<br>" + who.name + " HP: " + who.hp;
    who.hp -= takeDamage;
    if (who.hp <= 0) {
        who.hp = 0;
        text.innerHTML += " --> HP: " + who.hp;
        gameOver(who);
        winFlag = 1;
    } else {
        text.innerHTML += " --> HP: " + who.hp;
        winFlag = 0;
    }
}
function addXP(addxp) {
    player_st.xp += addxp;
    if (i == 0) { rockUpXp = 100; }
    if (addxp >= player_st.upLevXP) {
        player_st.lv++;
        addxp -= player_st.upLevXP;
        player_st.upLevXP = rockUpXp * 1.3;
        rockUpXp = rockUpXp * 1.3
    }
    player_st.upLevXP -= addxp;
    i++;
}


//GameOver
async function gameOver(who) {
    reset(0, 1, 1);
    if (who == player_st) {
        let text = document.getElementById('black');
        text.innerHTML += "<br><br>--- GAME OVER ---";
        //message
        const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await setSleep(1000)
        let result = confirm('Do you want to clear texts?');
        flag = 0;
        if (result) {
            reset(1, 1, 1);
            let text = document.getElementById('black');
            text.innerHTML += "--- HOME ---";
        }
    } else {
        let text = document.getElementById('black');
        text.innerHTML += "<br>--- You Win! ---";
        //XPculculate
        addXP(enemy.xp);
    }
    flag = 0;
    turnCount = 0;
    enemyTurn = 0;
}

//resetText
function reset(black, red, green) {
    if (black == 1) {
        let text = document.getElementById('black');
        text.innerHTML = "";
    }
    if (red == 1) {
        let text = document.getElementById('red');
        text.innerHTML = "";
    }
    if (green == 1) {
        let text = document.getElementById('green');
        text.innerHTML = "";
    }
}
function setSleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}
function showStatus() {
    let enemyText = document.getElementById('red');
    enemyText.innerHTML = "<br>" + enemy.name + "..." +
        "<br>HP: " + enemy.hp + " ATK: " + enemy.atk + " DEF: " + enemy.def;
    if (eneDefFlag == 1) {
        enemyText.innerHTML += "<br>*Defensed*";
    }
    let playerText = document.getElementById('green');
    playerText.innerHTML = "<br>Player..." +
        "<br>HP: " + player_st.hp + " ATK: " + player_st.atk + " DEF: " + player_st.def;
    if (playerDefFlag == 1) {
        playerText.innerHTML += "<br>*Defensed*";
    }
}

/*
--- FunctionTemplate ---

function name() {
    if (flag == 0) {
        reset(0, 1, 1);
        let text = document.getElementById('black');
        text.innerHTML += "";
    }
}

*/
