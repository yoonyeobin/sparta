import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor(stage) {
        this.hp = 100 + (stage - 1) * 10;
        this.power = (Math.floor(Math.random() * 10) + 2) + (stage - 1) * 10
    }

    attack(monster) {
        // 플레이어의 공격
        monster.hp -= this.power;
        console.log(chalk.green(`${this.power}만큼 피해를 입혔습니다.`));
    }
}

class Monster {
    constructor(stage) {
        this.hp = 100 + (stage - 1) * 10;
        this.power = (Math.floor(Math.random() * 5) + 1) + (stage - 1) * 5
    }

    attack(player) {
        // 몬스터의 공격
        player.hp -= this.power;
        console.log(`${this.power}만큼 피해를 입었습니다.`);
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 HP: ${player.hp}`,
            `Power: ${player.power}`
        ) +
        chalk.redBright(
            `| 몬스터 HP: ${monster.hp} |`,
            `Pwoer: ${monster.power}`
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];

    while (player.hp > 0 && monster.hp > 0) {
        displayStatus(stage, player, monster);

        console.log(
            chalk.green(
                `\n1. 공격한다 2. 도망간다.`,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');

        if (choice === '1') {
            console.log(chalk.green('플레이어가 공격을 선택하였습니다.'));
            player.attack(monster);

            if (monster.hp <= 0) {
                console.log("몬스터가 쓰러졌습니다.");
                return;
            }
        }
        else if (choice === '2') {
            console.log(chalk.green('플레이어가 도망쳤습니다. 게임이 종료됩니다.'));
            process.exit(0);
        }
        else {
            console.log("잘못된 입력입니다.")
            continue;
        }

        monster.attack(player);

        if (player.hp <= 0) {
            console.log('플레이어가 쓰러졌습니다. 게임이 종료됩니다.');
            process.exit(0);
        }
    }
};

export async function startGame() {
    console.clear();
    let stage = 1;
    
    while (stage <= 10) {
        const monster = new Monster(stage);
        const player = new Player(stage);
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건
        if (stage === 10) {
            console.log("게임을 클리어하셨습니다 축하드립니다.")
            process.exit(0);
        }
        console.log('다음 스테이지로 넘어갑니다.');
        stage++;
    }   
}