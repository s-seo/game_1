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
    cursors = this.input.keyboard.createCursorKeys();
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
    const distance = Phaser.Math.Distance.Between(dog.x, dog.y, player.x, player.y);
  
    if (distance > 5) { // 일정 거리 이상 멀어지면 따라가기 시작
      const angle = Phaser.Math.Angle.Between(dog.x, dog.y, player.x, player.y);
      dog.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    } else {
      dog.setVelocity(0);
    }
  }
  