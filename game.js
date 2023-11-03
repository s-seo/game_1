const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  let player, dog, cursors;
  
  function preload() {
    this.load.image('background', 'path/to/background.png'); 
    this.load.image('player', 'path/to/player.png');
    this.load.image('dog', 'path/to/dog.png');
  }
  
  function create() {
    this.add.image(400, 300, 'background').setScale(0.2);  // 400, 300은 이미지의 중심점의 좌표입니다.

    player = this.physics.add.sprite(400, 300, 'player');
    player.displayWidth = 300;  // 너비를 100픽셀로 설정
    player.displayHeight = 300;  // 높이를 100픽셀로 설정
    dog = this.physics.add.sprite(350, 300, 'dog');
    dog.displayWidth = 100;  // 너비를 100픽셀로 설정
    dog.displayHeight = 100;  // 높이를 100픽셀로 설정


    // Treat의 위치를 랜덤으로 설정 (화면에는 표시되지 않음)
    treat = {
        x: Math.random() * this.game.config.width,
        y: Math.random() * this.game.config.height
    };

    // 키보드 입력 설정
    cursors = this.input.keyboard.createCursorKeys();

    // 재시작 버튼
    restartButton = this.add.text(400, 300, 'More Treat?', { fontSize: '32px', fill: '#fff' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => { this.scene.restart(); })
        .setVisible(false);

    // 모바일 터치 이벤트
    this.input.on('pointerdown', (pointer) => {
        player.x = pointer.x;
        player.y = pointer.y;
    });
  }
  
  function update() {
    // player의 움직임을 초기화
    player.setVelocity(0);
  
    // 키보드 입력에 따라 player 움직임 처리
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
    }
  
    if (cursors.up.isDown) {
      player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      player.setVelocityY(160);
    }

    // dog이 player를 따라다니도록 설정
    const speed = 100;
    const distance_player = Phaser.Math.Distance.Between(dog.x, dog.y, player.x, player.y);
    const distance_treat = Phaser.Math.Distance.Between(dog.x, dog.y, treat.x, treat.y);

    if (distance_player > 5) { // 일정 거리 이상 멀어지면 따라가기 시작
      const angle = Phaser.Math.Angle.Between(dog.x, dog.y, player.x, player.y);
      dog.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

      // Dog가 Treat에 가까이 있으면 Treat를 따라감
      if (distance_treat < 100) {
          this.physics.moveTo(dog, treat.x, treat.y, speed);
      } else {
          this.physics.moveToObject(dog, player, speed);
      }
    } else {
      dog.setVelocity(0);
    }


    // 플레이어와 개가 화면을 벗어나지 않도록 함
    player.x = Phaser.Math.Clamp(player.x, 0, this.game.config.width);
    player.y = Phaser.Math.Clamp(player.y, 0, this.game.config.height);
    dog.x = Phaser.Math.Clamp(dog.x, 0, this.game.config.width);
    dog.y = Phaser.Math.Clamp(dog.y, 0, this.game.config.height);

    // dog이 treat에 도착했을 때
    if (distance_treat < 5) {
        endGame();
    }
  }

function endGame() {
    // 게임 종료 처리
    restartButton.setVisible(true);  // 재시작 버튼 표시
}