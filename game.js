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

    guard(monster) {
        // 플레이어가 방어했을 때 약한 공격
        monster.hp -= this.power / 2;
        console.log(chalk.green(`${this.power / 2}만큼 피해를 입혔습니다.`));
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
        console.log(chalk.red(`${this.power}만큼 피해를 입었습니다.`));
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

    while (player.hp > 0 && monster.hp > 0) {
        displayStatus(stage, player, monster);

        console.log(
            chalk.green(
                `\n1. 공격한다 2. 연속공격(25%) 3. 방어하기(50%) 4. 도망가기(10%)`,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');

        if (choice === '1') {
            console.log(chalk.blue('플레이어가 공격을 선택하였습니다.'));
            player.attack(monster);
            monster.attack(player);

            if (monster.hp <= 0) {
                console.log(chalk.blueBright("몬스터가 쓰러졌습니다."));
                return;
            }
        } else if (choice === '2') {
            console.log(chalk.blue('플레이어가 연속공격을 선택하였습니다.'));
            if (Math.random() < 0.25) {
                console.log(chalk.cyanBright('[성공]연속공격을 성공하여 2번 공격합니다!'));
                player.attack(monster);
                player.attack(monster);
                monster.attack(player);
            } else {
                console.log(chalk.redBright('[실패]연속공격에 실패하였습니다.'));
                monster.attack(player);
            }

        } else if (choice === '3') {
            console.log(chalk.blue('플레이어가 방어하기를 선택하였습니다.'));
            if (Math.random() < 0.5) {
                console.log(chalk.cyanBright('[성공]방어를 성공하였습니다. 몬스터에게 공격받지 않습니다!'));
                player.guard(monster);
            } else {
                console.log(chalk.redBright('[실패]방어에 실패하였습니다.'));
                monster.attack(player);
            }

        }
        else if (choice === '4') {
            console.log(chalk.blue('플레이어가 도망가기를 선택하였습니다.'));
            if (Math.random() < 0.1) {
                console.log(chalk.cyanBright("[성공]플레이어가 도망치는데 성공하여 다음 스테이지로 넘어갑니다."));
                return;
            } else {
                console.log(chalk.redBright("[실패]플레이어가 도망치는데 실패하였습니다."));
                monster.attack(player);
            }
        }
        else {
            console.log(chalk.redBright("잘못된 입력입니다. 1~4를 입력해주세요!"))
            continue;
        }


        if (player.hp <= 0) {
            console.log(chalk.redBright('플레이어가 쓰러졌습니다. 게임이 종료됩니다.'));
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
            console.log(chalk.greenBright("게임을 클리어하셨습니다 축하드립니다."))
            process.exit(0);
        }
        console.log(chalk.greenBright('다음 스테이지로 넘어갑니다.'));
        console.log(chalk.blue('플레이어의 체력이 회복됩니다.'));
        stage++;
    }
}