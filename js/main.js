"use strict"

let SystemScreen;   //内部スクリーン　全体を描画する画面
let DebugScreen;    //デバッグスクリーン　内部スクリーンを全体に描画する画面
let Camera;         //カメラ(メインスクリーン)　

let key = [];  //キー入力監視
let AnimationSwitch = [];   //NowActor毎のアニメーションインターバルを配列で一時保存管理　Animationメソッドでリセットされる

//画像定義--------------------------------------------------------------
let test; //スライド式トランジション実験用の画像
let Cursor_0; //カーソル画像
let field_0;
//---------------------------------------------------------------------

let Settings =
{
    FPS: 120,     //フレームレート
    CameraWidth: 1024,   //カメラ(メイン画面)の幅
    CameraHeight: 768,   //カメラ(メイン画面)の高さ
    TileSize: 32,        //タイルの一辺の長さ
    InputSpeed: 120,     //
}



let TextModule =
{
    Text_0: [],
    TextBox: [],
    SelectTextBox: [25, 1, 80, 80, 80, 80, 1, 1, 3],
}

let InputModule =
{
    InputMode: 0,
    InputActivate: 0,
    OnEventActivate: 0,
    DecimalsCounter: 0,
    
}

let Frags =
{
    MessageFrag: 0,
    XFrag: 0,
    XMax: 0,
    YFrag: 0,
    YMax: 0,
}

let TransitionParameter =
{
    TransitionSwicher: 0, //cameraメソッドのトランジション切り替え
    TransitionKey_0: Settings.CameraWidth, //トランジションでＡｎｉｍａｔｉｏｎするためのキー数字？？？的な
    TransitionKey_1: 0
}

let WindowParameter =
{
    WindowOnOff: 0, //windowのon/off
    WindowSwicher: 0, //windowのレイアウト変更 0...MessageWindow
    Window_0:
    {
        Image: [],
        Array: [
            0, 1, 1, 1, 1, 1, 1, 1, 2,
            7, 8, 8, 8, 8, 8, 8, 8, 9,
            14, 15, 15, 15, 15, 15, 15, 15, 16
        ],
        WindowLengthX: 9,
        WindowLengthY: 3,
        TileColumn: 7,
        TileLow: 4,
        TileSize: 128,
    },
    Window_1:
    {
        Image: [],
        Array: [
            21, 21, 21, 21, 21, 0, 1, 1, 2,
            21, 21, 21, 21, 21, 7, 8, 8, 9,
            21, 21, 21, 21, 21, 14, 15, 15, 16
        ],
        WindowLengthX: 9,
        WindowLengthY: 3,
        TileColumn: 7,
        TileLow: 4,
        TileSize: 128,
    },
    Window_2:
    {
        Image: [],
        Array: [
            //戦闘背景＆敵表示用ウィンドウ
            [
                0, 1, 1, 1, 1, 1, 1, 1, 2,
                8, 7, 7, 7, 7, 7, 7, 7, 10,
                8, 7, 7, 7, 7, 7, 7, 7, 10,
                8, 7, 7, 7, 7, 7, 7, 7, 10,
                16, 17, 17, 17, 17, 17, 17, 17, 18
            ],
            //味方パラメーター表示用ウィンドウ
            [
                48, 49, 7, 7, 7, 7, 7, 7, 7,
                56, 57, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7,
            ],
            //戦闘コマンド表示用ウィンドウ
            [
                7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 7, 7, 7, 7, 7, 7, 7, 7,
                7, 64, 65, 66, 67, 68, 69, 70, 7,
                7, 72, 73, 74, 75, 76, 77, 78, 7
            ]
        ],
        WindowLengthX: 9,
        WindowLengthY: 5,
        TileColumn: 8,
        TileLow: 10,
        TileSize: 128,
    },
}

let SoundData =
{
    BackGroundMusic:
    {
        BGM_0: []
    },
    SoundEffect:
    {
        SE_0: [],
        SE_1: [],
        SE_2: []
    },
}

class MakeMap {
    constructor(Array, Name, TileColumn, TileLow, EventTileColumn, EventTileLow, MapLengthX, MapLengthY) {
        this.Name = Name;
        this.Array = Array;
        this.TileImages = [];
        this.Music = [];
        this.TileColumn = TileColumn;
        this.TileLow = TileLow;
        this.EventTileColumn = EventTileColumn;
        this.EventTuleLow = EventTileLow;
        this.MapLengthX = MapLengthX;
        this.MapLengthY = MapLengthY;
    }

}

let ActorData =
{
    Global:
    {
        Creature:
        {
            Player:
            {
                Name: "タナカ",
                Image: [],
                TileWidth: 32,
                TileHeight: 32,
                PositionX: 224,
                PositionY: 160,
                AnimationKey: 0,
                AnimationSpeed: 3,
                Angle: 0,
                EventNumber: 1,
                HP: 120,
                MP: 60,
                Lv: 9,
            },
            Iris:
            {
                Name: "ヤマダ",
                Image: [],
                TileWidth: 32,
                TileHeight: 32,
                PositionX: 224,
                PositionY: 160,
                AnimationKey: 0,
                AnimationSpeed: 3,
                Angle: 0,
                EventNumber: 1,
                HP: 60,
                MP: 150,
                Lv: 7,
            },
            Igniss:
            {
                Name: "ヨシムラ",
                Image: [],
                TileWidth: 32,
                TileHeight: 32,
                PositionX: 224,
                PositionY: 160,
                AnimationKey: 0,
                AnimationSpeed: 3,
                Angle: 0,
                EventNumber: 1,
                HP: 140,
                MP: 15,
                Lv: 8,
            },
        },
        Object:
        {

        }
    },
    Local:
    {
        Map_0:
        {
            Creature:
            {
                Friend:
                {
                    Name: "Friend",
                    Image: [],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: 160,
                    PositionY: 128,
                    AnimationKey: 0,
                    AnimationSpeed: 5,
                    Angle: 0,
                    EventNumber: 1,
                    EventIndex: 0,
                    MyCommand: [
                        () => {
                            setTimeout(() => { InputModule.InputMode = 1 }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 500)
                            if (Frags.MessageFrag === 0) {
                                WindowParameter.WindowOnOff = 1;
                                WindowParameter.WindowSwicher = 0;
                                MakeText("それじゃあBさきにいってるね");
                            }
                            if (Frags.MessageFrag === 1) {
                                Frags.MessageFrag = 0;
                                WindowParameter.WindowOnOff = 0;

                                setTimeout(() => {
                                    TransitionCut(1)
                                    setTimeout(() => {
                                        Teleport(ActorData.Local.Map_0.Creature.Friend, 320, 128)
                                    }, 1000/*taransitionの秒数に合わせる*/)
                                }, 0)
                                LookPlayer(ActorData.Local.Map_0.Creature.Friend)
                                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
                                setTimeout(() => { ActorData.Local.Map_0.Creature.Friend.EventIndex = 1 }, 0)
                                setTimeout(() => { InputModule.InputActivate = 0 }, 1500);
                                setTimeout(() => { InputModule.InputMode = 0 }, 1500)
                            }
                        },
                        () => {
                            setTimeout(() => { InputModule.InputMode = 1 }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 500)
                            if (Frags.MessageFrag === 0) {
                                WindowParameter.WindowOnOff = 1;
                                WindowParameter.WindowSwicher = 0;

                                MakeText("それじゃあBさきにいってるね");
                            }
                            if (Frags.MessageFrag === 1) {
                                Frags.MessageFrag = 0;
                                WindowParameter.WindowOnOff = 0;

                                setTimeout(() => {
                                    TransitionCut(0)
                                    setTimeout(() => {
                                        Teleport(ActorData.Local.Map_0.Creature.Friend, 160, 128)
                                    }, 3000)
                                }, 0)
                                LookPlayer(ActorData.Local.Map_0.Creature.Friend);
                                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
                                setTimeout(() => { ActorData.Local.Map_0.Creature.Friend.EventIndex = 0 }, 0)
                                setTimeout(() => { InputModule.InputActivate = 0 }, 5600);
                                setTimeout(() => { InputModule.InputMode = 0 }, 5600)
                            }
                        },
                    ]
                }
            },
            Object:
            {
                TreasureChest:
                {
                    Name: "TreasureChest",
                    Image: [],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: 352,
                    PositionY: 96,
                    AnimationKey: 0,
                    AnimationSpeed: 0,
                    Angle: 0,
                    EventNumber: 1,
                    EventIndex: 0,
                    MyCommand: [
                        () => {
                            setTimeout(() => { InputModule.InputMode = 1 }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 500)
                            if (Frags.MessageFrag === 0) {
                                WindowParameter.WindowOnOff = 1;
                                WindowParameter.WindowSwicher = 0;
                                setTimeout(() => { ActorData.Local.Map_0.Object.TreasureChest.AnimationKey = 1 }, 0)

                                MakeText("たからばこBをBあけた");
                            }
                            if (Frags.MessageFrag === 1) {
                                MakeText("なかみはBからBだった");
                            }
                            if (Frags.MessageFrag === 2) {
                                Frags.MessageFrag = 0;
                                WindowParameter.WindowOnOff = 0;
                                setTimeout(() => { ActorData.Local.Map_0.Object.TreasureChest.EventIndex = 1 }, 0)
                                setTimeout(() => { InputModule.InputMode = 0 }, 0)
                            }
                        },
                        () => {
                            setTimeout(() => { InputModule.InputMode = 1 }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 500)
                            if (Frags.MessageFrag === 0) {
                                WindowParameter.WindowOnOff = 1;
                                WindowParameter.WindowSwicher = 0;
                                MakeText("なかみはBからBだ");
                            }
                            if (Frags.MessageFrag === 1) {
                                Frags.MessageFrag = 0;
                                WindowParameter.WindowOnOff = 0;
                                setTimeout(() => { InputModule.InputMode = 0 }, 0)
                            }
                        }
                    ]
                },
                TreasureChest_1:
                {
                    Name: "TreasureChest",
                    Image: [],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: [320, 288, 256],
                    PositionY: [96, 96, 96],
                    // PositionX:320,
                    // PositionY:96,
                    AnimationKey: 0,
                    AnimationSpeed: 0,
                    Angle: 0,
                    EventNumber: 1,
                    EventIndex: 0,
                    MyCommand: [
                        () => {
                            setTimeout(() => { InputModule.InputMode = 1 }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 500)
                            if (Frags.MessageFrag === 0) {
                                WindowParameter.WindowOnOff = 1;
                                WindowParameter.WindowSwicher = 0;
                                setTimeout(() => { ActorData.Local.Map_0.Object.TreasureChest_1.AnimationKey = 1 }, 0)
                                MakeText("たからばこBをBあけた");
                            }
                            if (Frags.MessageFrag === 1) {
                                MakeText("なかみはBからBだった");
                            }
                            if (Frags.MessageFrag === 2) {
                                Frags.MessageFrag = 0;
                                WindowParameter.WindowOnOff = 0;
                                setTimeout(() => { ActorData.Local.Map_0.Object.TreasureChest_1.EventIndex = 1 }, 0)
                                setTimeout(() => { InputModule.InputMode = 0 }, 0)
                            }
                        },
                        () => {
                            setTimeout(() => { InputModule.InputMode = 1 }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 500)
                            if (Frags.MessageFrag === 0) {
                                WindowParameter.WindowOnOff = 1;
                                WindowParameter.WindowSwicher = 0;
                                MakeText("なかみはBからBだ");
                            }
                            if (Frags.MessageFrag === 1) {
                                WindowParameter.WindowSwicher = 1;
                                MakeText("ふたBをBとじますか")
                            }
                            if (Frags.MessageFrag === 2 && Frags.YFrag === 0) {
                                Frags.MessageFrag = 0;
                                Frags.YFrag = 0;
                                Frags.XFrag = 0;
                                WindowParameter.WindowOnOff = 0;
                                setTimeout(() => { ActorData.Local.Map_0.Object.TreasureChest_1.AnimationKey = 0 }, 0)
                                setTimeout(() => { ActorData.Local.Map_0.Object.TreasureChest_1.EventIndex = 0 }, 0)
                                setTimeout(() => { InputModule.InputMode = 0 }, 0)
                            }
                            if (Frags.MessageFrag === 2 && Frags.YFrag === 1) {
                                Frags.MessageFrag = 0;
                                Frags.YFrag = 0;
                                Frags.XFrag = 0;
                                WindowParameter.WindowOnOff = 0;
                                setTimeout(() => { InputModule.InputMode = 0 }, 0)
                            }
                        }
                    ]
                },
                EventTile_0:
                {
                    Name: "EventTile",
                    Image: [null],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: [416],
                    PositionY: [160],
                    AnimationKey: 0,
                    AnimationSpeed: 0,
                    Angle: 0,
                    EventNumber: 0,
                    EventIndex: 0,
                    MyCommand: [
                        () => {
                            setTimeout(() => {
                                TransitionCut(1)
                                setTimeout(() => {
                                    setTimeout(() => {
                                        ActorData.Global.Creature.Player.PositionX = 128;
                                        ActorData.Global.Creature.Player.PositionY = 128;
                                        ActorData.Global.Creature.Player.Angle = 1;
                                        Game.Change(
                                            Map_1,
                                            [ActorData.Global.Creature.Player],
                                            [ActorData.Global.Creature.Player],
                                            [ActorData.Local.Map_1.Object.EventTile_0, ActorData.Local.Map_1.Object.EventTile_1],
                                            ActorData.Global.Creature.Player,
                                            ActorData.Global.Creature.Player,
                                            { BGM: SoundData.BackGroundMusic.BGM_0, SE: [SoundData.SoundEffect.SE_0, SoundData.SoundEffect.SE_1, SoundData.SoundEffect.SE_2] },
                                        )
                                    }, 0)
                                }, 1000/*taransitionの秒数に合わせる*/)
                            }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 1500)
                        }
                    ]
                }
            }
        },
        Map_1:
        {
            Creature:
            {
                Hedoro:
                {
                    Name: "ヘドロ",
                    Image: [],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: 224,
                    PositionY: 160,
                    AnimationKey: 0,
                    AnimationSpeed: 3,
                    Angle: 0,
                    EventNumber: 1,
                    HP: 140,
                    MP: 15,
                    Lv: 8,
                }
            },
            Object:
            {
                EventTile_0:
                {
                    Name: "EventTile",
                    Image: [null],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: 128,
                    PositionY: 128,
                    AnimationKey: 0,
                    AnimationSpeed: 0,
                    Angle: 0,
                    EventNumber: 0,
                    EventIndex: 0,
                    MyCommand: [
                        () => {
                            setTimeout(() => {
                                TransitionCut(1)
                                setTimeout(() => {
                                    setTimeout(() => {
                                        ActorData.Global.Creature.Player.PositionX = 416;
                                        ActorData.Global.Creature.Player.PositionY = 160;
                                        ActorData.Global.Creature.Player.Angle = 2;
                                        Game.Change(
                                            Map_0,
                                            [ActorData.Global.Creature.Player, ActorData.Local.Map_0.Creature.Friend, ActorData.Local.Map_0.Object.TreasureChest, ActorData.Local.Map_0.Object.TreasureChest_1],
                                            [ActorData.Global.Creature.Player, ActorData.Local.Map_0.Creature.Friend],
                                            [ActorData.Local.Map_0.Creature.Friend, ActorData.Local.Map_0.Object.TreasureChest, ActorData.Local.Map_0.Object.TreasureChest_1, ActorData.Local.Map_0.Object.EventTile_0],
                                            ActorData.Global.Creature.Player,
                                            ActorData.Global.Creature.Player,
                                            { BGM: SoundData.BackGroundMusic.BGM_0, SE: [SoundData.SoundEffect.SE_0, SoundData.SoundEffect.SE_1, SoundData.SoundEffect.SE_2] },
                                        )
                                    }, 0)
                                }, 1000/*taransitionの秒数に合わせる*/)
                            }, 0)
                            setTimeout(() => { InputModule.InputActivate = 0 }, 1500)
                        }
                    ]
                },
                EventTile_1:
                {
                    Name: "EncountTile",
                    Image: [null],
                    TileWidth: 32,
                    TileHeight: 32,
                    PositionX: [
                        128, 160, 192, 224, 256, 288, 320,
                        128, 160, 192, 224, 256, 288, 320,
                        128, 160, 192, 224, 256, 288, 320,
                        128, 160, 192, 224, 256, 288, 320,
                        128, 160, 192, 224, 256, 288, 320,
                    ],
                    PositionY: [
                        256, 256, 256, 256, 256, 256, 256,
                        288, 288, 288, 288, 288, 288, 288,
                        320, 320, 320, 320, 320, 320, 320,
                        352, 352, 352, 352, 352, 352, 352,
                        384, 384, 384, 384, 384, 384, 384,
                    ],
                    AnimationKey: 0,
                    AnimationSpeed: 0,
                    Angle: 0,
                    EventNumber: 0,
                    EventIndex: 0,
                    MyCommand: [
                        () => {
                            let EncountLimit = Math.round((Math.random() * (8 - 5)) + 5)
                            if (BattleModule.Encounter >= EncountLimit) {
                                setTimeout(() => {
                                    TransitionCut(1)
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            InputModule.InputMode = 2;
                                            WindowParameter.WindowOnOff = 1;
                                            WindowParameter.WindowSwicher = 2;
                                            // BattleModule.BattleKey_0 = 1;
                                        }, 0)
                                    }, 1000/*taransitionの秒数に合わせる*/)
                                }, 0)
                                EncountLimit = 0;
                                setTimeout(() => { InputModule.InputActivate = 0 }, 1500)
                            }
                            if (BattleModule.Encounter < EncountLimit) {
                                BattleModule.Encounter++;
                                setTimeout(() => { InputModule.InputActivate = 0 }, 0)
                            }
                        }
                    ]
                },
            }
        }
    }
}

let BattleModule =
{
    Encounter: 0,
    BattleKey_0: 0,
    BattlePhase: 0,
    BattleMembers: [ActorData.Global.Creature.Player, ActorData.Global.Creature.Iris, ActorData.Global.Creature.Igniss],
    // Enemies:[]
    // Enemies:[ActorData.Local.Map_1.Creature.Hedoro,ActorData.Local.Map_1.Creature.Hedoro,ActorData.Local.Map_1.Creature.Hedoro]
    Enemies:[ActorData.Local.Map_1.Creature.Hedoro]
}

class MakeGame {
    constructor() {
        this.NowMap;
        this.NowAllActors;
        this.AutoAnimation;
        this.NowActors;
        this.PlayableActor;
        this.NowOnCamera;
        this.NowSounds;
        this.Command = [];
    }
    Change(NowMap, NowAllActors, AutoAnimation, NowActors, PlayableActor, NowOnCamera, NowSounds) {
        this.NowMap = NowMap;
        this.NowAllActors = NowAllActors;
        this.AutoAnimation = AutoAnimation;
        this.NowActors = NowActors;
        this.PlayableActor = PlayableActor;
        this.NowOnCamera = NowOnCamera;
        this.NowSounds = NowSounds;
    }
    Draw() {
        const ctx = SystemScreen.getContext("2d");

        //Array[1]...レイヤー1描画
        for (let y = 0; y < this.NowMap.MapLengthY; y++) {
            for (let x = 0; x < this.NowMap.MapLengthX; x++) {
                let ix = ((this.NowMap.Array[1][y * this.NowMap.MapLengthX + x]) % this.NowMap.TileColumn) * Settings.TileSize;
                let iy = Math.floor((this.NowMap.Array[1][y * this.NowMap.MapLengthX + x]) / this.NowMap.TileColumn) * Settings.TileSize;
                ctx.drawImage(this.NowMap.TileImages[1], ix, iy, Settings.TileSize, Settings.TileSize, x * Settings.TileSize, y * Settings.TileSize, Settings.TileSize, Settings.TileSize);
            }
        }

        //Array[2]...レイヤー2描画
        for (let y = 0; y < this.NowMap.MapLengthY; y++) {
            for (let x = 0; x < this.NowMap.MapLengthX; x++) {
                let ix = ((this.NowMap.Array[2][y * this.NowMap.MapLengthX + x]) % this.NowMap.TileColumn) * Settings.TileSize;
                let iy = Math.floor((this.NowMap.Array[2][y * this.NowMap.MapLengthX + x]) / this.NowMap.TileColumn) * Settings.TileSize;
                ctx.drawImage(
                    this.NowMap.TileImages[2],
                    ix, iy, Settings.TileSize, Settings.TileSize,
                    x * Settings.TileSize, y * Settings.TileSize, Settings.TileSize, Settings.TileSize);
            }
        }

        //NowActors描画
        for (let i = 0; i < this.NowActors.length; i++) {
            if (this.NowActors[i].Image[0] !== null && typeof (this.NowActors[i].PositionX) === 'number') {
                ctx.drawImage(
                    this.NowActors[i].Image[0],
                    (this.NowActors[i].AnimationKey % 2) * this.NowActors[i].TileWidth, this.NowActors[i].TileHeight * this.NowActors[i].Angle, this.NowActors[i].TileWidth, this.NowActors[i].TileHeight,
                    this.NowActors[i].PositionX, this.NowActors[i].PositionY - 10, this.NowActors[i].TileWidth, this.NowActors[i].TileHeight
                )
            }

            if (this.NowActors[i].Image[0] !== null && typeof (this.NowActors[i].PositionX) === 'object') {
                for (let j = 0; j < this.NowActors[i].PositionX.length; j++) {
                    ctx.drawImage(
                        this.NowActors[i].Image[0],
                        (this.NowActors[i].AnimationKey % 2) * this.NowActors[i].TileWidth, this.NowActors[i].TileHeight * this.NowActors[i].Angle, this.NowActors[i].TileWidth, this.NowActors[i].TileHeight,
                        this.NowActors[i].PositionX[j], this.NowActors[i].PositionY[j] - 10, this.NowActors[i].TileWidth, this.NowActors[i].TileHeight
                    )
                }
            }
        }

        //PlayableActor
        ctx.drawImage(
            this.PlayableActor.Image[0],
            (this.PlayableActor.AnimationKey % 2) * this.PlayableActor.TileWidth, this.PlayableActor.TileHeight * this.PlayableActor.Angle, this.PlayableActor.TileWidth, this.PlayableActor.TileHeight,
            this.PlayableActor.PositionX, this.PlayableActor.PositionY - 10, this.PlayableActor.TileWidth, this.PlayableActor.TileHeight
        )
    }
    Camera() {
        const ctx = Camera.getContext("2d");
        ctx.drawImage(
            SystemScreen,
            this.NowOnCamera.PositionX - (Settings.CameraWidth / 6) + Settings.TileSize / 2, this.NowOnCamera.PositionY - (Settings.CameraHeight / 6) + Settings.TileSize / 2, Settings.CameraWidth / 3, Settings.CameraHeight / 3,
            0, 0, Settings.CameraWidth, Settings.CameraHeight
        )

        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(5, 5, 195, 195)
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, 195, 195)
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.font = "20px monospace";
        ctx.fillText(`X:${this.PlayableActor.PositionX}`, 15, 30)
        ctx.fillText(`Y:${this.PlayableActor.PositionY}`, 15, 50)
        ctx.fillText(`X:${this.PlayableActor.PositionX / Settings.TileSize}`, 15, 70)
        ctx.fillText(`Y:${this.PlayableActor.PositionY / Settings.TileSize}`, 15, 90)
        ctx.fillText(`InputActivate:${InputModule.InputActivate}`, 15, 110)
        // ctx.fillText(`TransitionKey:${TransitionKey_1}`,15,130)
        ctx.fillText(`InputMode:${InputModule.InputMode}`, 15, 130)
        // ctx.fillText(`MessageFrag:${Frags.MessageFrag}`,15,150)
        // ctx.fillText(`DecimalsCounter:${InputModule.DecimalsCounter}`,15,150)
        ctx.fillText(`遭遇値:${BattleModule.Encounter}`, 15, 150)
        ctx.fillText(`乗りイベント:${InputModule.OnEventActivate}`, 15, 190)
    }
    Transition() {
        const ctx = Camera.getContext("2d");
        if (TransitionParameter.TransitionSwicher === 0) {
            ctx.drawImage(
                test,
                0, 0, Settings.CameraWidth, Settings.CameraHeight,
                TransitionParameter.TransitionKey_0, 0, Settings.CameraWidth, Settings.CameraHeight
            )
        }
        if (TransitionParameter.TransitionSwicher === 1) {
            ctx.fillStyle = `rgba(0,0,0,${TransitionParameter.TransitionKey_1})`;
            ctx.fillRect(0, 0, Settings.CameraWidth, Settings.CameraHeight)
        }
    }
    Battle() {
        const ctx = Camera.getContext("2d");
        ctx.globalAlpha = BattleModule.BattleKey_0;
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.fillRect(10, 100, Settings.CameraWidth - 20, 568)
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 100, Settings.CameraWidth - 20, 568)
        ctx.font = "50px monospace";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillText("Battle()表示中", Settings.CameraWidth / 2 - 50 * 7 / 2, Settings.CameraHeight / 2)
        ctx.globalAlpha = 1;
    }
    Window() {
        const ctx = Camera.getContext("2d");

        if (WindowParameter.WindowOnOff === 1) //ここでウィンドウのオンオフ切り替え、0...Off 1...On デフォでOff
        {
            //メッセージウィンドウモード
            if (WindowParameter.WindowSwicher === 0) {
                //Messagewindow描画 突貫工事でマジックナンバー多めだから要改修
                for (let y = 0; y < WindowParameter.Window_0.WindowLengthY; y++) {
                    for (let x = 0; x < WindowParameter.Window_0.WindowLengthX; x++) {
                        let ix = ((WindowParameter.Window_0.Array[y * WindowParameter.Window_0.WindowLengthX + x]) % WindowParameter.Window_0.TileColumn) * WindowParameter.Window_0.TileSize;
                        let iy = Math.floor((WindowParameter.Window_0.Array[y * WindowParameter.Window_0.WindowLengthX + x]) / WindowParameter.Window_0.TileColumn) * WindowParameter.Window_0.TileSize;
                        ctx.drawImage(
                            WindowParameter.Window_0.Image[0],
                            ix, iy, WindowParameter.Window_0.TileSize, WindowParameter.Window_0.TileSize,
                            x * WindowParameter.Window_0.TileSize - WindowParameter.Window_0.TileSize * 0.5 /*半マスずらす定数項*/, y * WindowParameter.Window_0.TileSize + WindowParameter.Window_0.TileSize * 3.5 /*3.5マスずらす定数項*/, WindowParameter.Window_0.TileSize, WindowParameter.Window_0.TileSize);
                    }
                }
                for (let i = 0; i < TextModule.TextBox.length; i++) {
                    if (i < 18) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.TextBox[i] * 52, 0, 52, 48,
                            i * 52 + 44, 550, 52, 48
                        )
                    }
                    if (18 <= i && i < 18 * 2) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.TextBox[i] * 52, 0, 52, 48,
                            (i - 18) * 52 + 44, 615, 52, 48
                        )
                    }
                    if (18 * 2 <= i && i < 18 * 3) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.TextBox[i] * 52, 0, 52, 48,
                            (i - 18 * 2) * 52 + 44, 680, 52, 48
                        )
                    }
                }
            }
            //選択肢付きメッセージウィンドウ
            if (WindowParameter.WindowSwicher === 1) {
                for (let y = 0; y < WindowParameter.Window_0.WindowLengthY; y++) {
                    for (let x = 0; x < WindowParameter.Window_0.WindowLengthX; x++) {
                        let ix = ((WindowParameter.Window_0.Array[y * WindowParameter.Window_0.WindowLengthX + x]) % WindowParameter.Window_0.TileColumn) * WindowParameter.Window_0.TileSize;
                        let iy = Math.floor((WindowParameter.Window_0.Array[y * WindowParameter.Window_0.WindowLengthX + x]) / WindowParameter.Window_0.TileColumn) * WindowParameter.Window_0.TileSize;
                        ctx.drawImage(
                            WindowParameter.Window_0.Image[0],
                            ix, iy, WindowParameter.Window_0.TileSize, WindowParameter.Window_0.TileSize,
                            x * WindowParameter.Window_0.TileSize - WindowParameter.Window_0.TileSize * 0.5 /*半マスずらす定数項*/, y * WindowParameter.Window_0.TileSize + WindowParameter.Window_0.TileSize * 3.5 /*3.5マスずらす定数項*/, WindowParameter.Window_0.TileSize, WindowParameter.Window_0.TileSize);
                    }
                }
                for (let y = 0; y < WindowParameter.Window_1.WindowLengthY; y++) {
                    for (let x = 0; x < WindowParameter.Window_1.WindowLengthX; x++) {
                        let ix = ((WindowParameter.Window_1.Array[y * WindowParameter.Window_1.WindowLengthX + x]) % WindowParameter.Window_1.TileColumn) * WindowParameter.Window_1.TileSize;
                        let iy = Math.floor((WindowParameter.Window_1.Array[y * WindowParameter.Window_1.WindowLengthX + x]) / WindowParameter.Window_1.TileColumn) * WindowParameter.Window_1.TileSize;
                        ctx.drawImage(
                            WindowParameter.Window_1.Image[0],
                            ix, iy, WindowParameter.Window_1.TileSize, WindowParameter.Window_1.TileSize,
                            x * WindowParameter.Window_1.TileSize - WindowParameter.Window_1.TileSize * 0.5 /*半マスずらす定数項*/, y * WindowParameter.Window_1.TileSize + WindowParameter.Window_1.TileSize * 3.5/*3.5マスずらす定数項*/, WindowParameter.Window_1.TileSize, WindowParameter.Window_1.TileSize);
                    }
                }
                for (let i = 0; i < TextModule.TextBox.length; i++) {
                    if (i < 11) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.TextBox[i] * 52, 0, 52, 48,
                            i * 52 + 44, 550, 52, 48
                        )
                    }
                    if (11 <= i && i < 11 * 2) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.TextBox[i] * 52, 0, 52, 48,
                            (i - 11) * 52 + 44, 615, 52, 48
                        )
                    }
                    if (11 * 2 <= i && i < 11 * 3) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.TextBox[i] * 52, 0, 52, 48,
                            (i - 11 * 2) * 52 + 44, 680, 52, 48
                        )
                    }
                }
                for (let i = 0; i < 9; i++) {
                    if (i < 3) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.SelectTextBox[i] * 52, 0, 52, 48,
                            i * 52 + 820, 550, 52, 48
                        )
                    }
                    if (3 <= i && i < 3 * 2) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.SelectTextBox[i] * 52, 0, 52, 48,
                            (i - 3) * 52 + 820, 615, 52, 48
                        )
                    }
                    if (3 * 2 <= i && i < 3 * 3) {
                        ctx.drawImage(
                            TextModule.Text_0[0],
                            TextModule.SelectTextBox[i] * 52, 0, 52, 48,
                            (i - 3 * 2) * 52 + 820, 680, 52, 48
                        )
                    }
                }

                if (Frags.YFrag === 0) ctx.drawImage(Cursor_0, 0, 0, 52, 48, 710, 550, 52, 48);
                if (Frags.YFrag === 1) ctx.drawImage(Cursor_0, 0, 0, 52, 48, 710, 680, 52, 48);
                if (Frags.YFrag < 0) Frags.YFrag = 0;
                if (Frags.YFrag > 1) Frags.YFrag = 1;

            }
            //戦闘ウィンドウ(作成中)
            if (WindowParameter.WindowSwicher === 2) {
                // ctx.fillStyle = "rgba(27,27,27,1)";
                // ctx.fillRect(4, 132, 1024 - 8, 512 - 8)

                ctx.drawImage(field_0,0,0,338,169,4,132,338*3,169*3)  //仮置き　マジックナンバーだらけの付け焼刃

                //-----------------------------------------------------------------------------------------------
                //戦闘背景＆敵表示用ウィンドウ
                for (let y = 0; y < WindowParameter.Window_2.WindowLengthY; y++) {
                    for (let x = 0; x < WindowParameter.Window_2.WindowLengthX; x++) {
                        let ix = ((WindowParameter.Window_2.Array[0][y * WindowParameter.Window_2.WindowLengthX + x]) % WindowParameter.Window_2.TileColumn) * WindowParameter.Window_2.TileSize;
                        let iy = Math.floor((WindowParameter.Window_2.Array[0][y * WindowParameter.Window_2.WindowLengthX + x]) / WindowParameter.Window_2.TileColumn) * WindowParameter.Window_2.TileSize;
                        ctx.drawImage(
                            WindowParameter.Window_2.Image[0],
                            ix, iy, WindowParameter.Window_2.TileSize, WindowParameter.Window_2.TileSize,
                            x * WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 /*半マスずらす定数項*/, y * WindowParameter.Window_2.TileSize + WindowParameter.Window_2.TileSize * 0.5 /*3.5マスずらす定数項*/, WindowParameter.Window_2.TileSize, WindowParameter.Window_2.TileSize);
                    }
                }

                for(let i = 0;i < BattleModule.Enemies.length;i++)
                {
                    ctx.drawImage(
                        BattleModule.Enemies[i].Image[0],
                        0,0,384,384,
                        (344 * i) - 24,Settings.CameraHeight / 2 - 384 / 2,384,384
                    )
                }
                //-----------------------------------------------------------------------------------------------

                //-----------------------------------------------------------------------------------------------
                // 味方パラメーター表示用ウィンドウ(作成中)
                for (let k = 0; k < BattleModule.BattleMembers.length; k++) {
                    for (let y = 0; y < WindowParameter.Window_2.WindowLengthY; y++) {
                        for (let x = 0; x < WindowParameter.Window_2.WindowLengthX; x++) {
                            let ix = ((WindowParameter.Window_2.Array[1][y * WindowParameter.Window_2.WindowLengthX + x]) % WindowParameter.Window_2.TileColumn) * WindowParameter.Window_2.TileSize;
                            let iy = Math.floor((WindowParameter.Window_2.Array[1][y * WindowParameter.Window_2.WindowLengthX + x]) / WindowParameter.Window_2.TileColumn) * WindowParameter.Window_2.TileSize;
                            ctx.drawImage(
                                WindowParameter.Window_2.Image[0],
                                ix, iy, WindowParameter.Window_2.TileSize, WindowParameter.Window_2.TileSize,
                                x * WindowParameter.Window_2.TileSize + k * (WindowParameter.Window_2.TileSize + WindowParameter.Window_2.TileSize / 4), y * WindowParameter.Window_2.TileSize/*3.5マスずらす定数項*/, WindowParameter.Window_2.TileSize, WindowParameter.Window_2.TileSize);
                        }
                    }
                    //名前＆ステータス表示
                    MakePlayerName(BattleModule.BattleMembers[k]);
                    for (let i = 0; i < TextModule.TextBox.length; i++) {
                        if (i < 5) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                i * (24 + 2) + 16 + (k * (128 + 32)), 12, 24, 36
                            )
                        }
                        if (5 <= i && i < 5 * 2) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5) * (24 + 2) + 16 + (k * (128 + 32)), 12 + (24 + 6), 24, 36
                            )
                        }
                        if (5 * 2 <= i && i < 5 * 3) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5 * 2) * (24 + 2) + 16 + (k * (128 + 32)), 12 + (24 + 6) * 2, 24, 36
                            )
                        }
                        if (5 * 3 <= i && i < 5 * 4) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5 * 3) * (24 + 2) + 16 + (k * (128 + 32)), 12 + (24 + 6) * 3, 24, 36
                            )
                        }
                        if (5 * 4 <= i && i < 5 * 5) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5 * 4) * (24 + 2) + 16 + (k * (128 + 32)), 12 + (24 + 6) * 4, 24, 36
                            )
                        }
                    }
                }
                //-----------------------------------------------------------------------------------------------



                //-----------------------------------------------------------------------------------------------
                // 戦闘コマンドウィンドウ
                for (let y = 0; y < WindowParameter.Window_2.WindowLengthY; y++) {
                    for (let x = 0; x < WindowParameter.Window_2.WindowLengthX; x++) {
                        let ix = ((WindowParameter.Window_2.Array[2][y * WindowParameter.Window_2.WindowLengthX + x]) % WindowParameter.Window_2.TileColumn) * WindowParameter.Window_2.TileSize;
                        let iy = Math.floor((WindowParameter.Window_2.Array[2][y * WindowParameter.Window_2.WindowLengthX + x]) / WindowParameter.Window_2.TileColumn) * WindowParameter.Window_2.TileSize;
                        ctx.drawImage(
                            WindowParameter.Window_2.Image[0],
                            ix, iy, WindowParameter.Window_2.TileSize, WindowParameter.Window_2.TileSize,
                            x * WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 /*半マスずらす定数項*/, y * WindowParameter.Window_2.TileSize + WindowParameter.Window_2.TileSize * 1 /*3.5マスずらす定数項*/, WindowParameter.Window_2.TileSize, WindowParameter.Window_2.TileSize);
                    }
                }


                if(BattleModule.BattlePhase === 0)
                {
                    Frags.YMax = 4;
                    MakeText("こうげき とくぎ  じゅもん どうぐ  にげる  ");
                    for (let i = 0; i < TextModule.TextBox.length; i++) {
                        if (i < 5) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                i * (24 + 2) + WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 + 16 + 24 * 4 + 12, 566 + 22, 24, 36
                            )
                        }
                        if (5 <= i && i < 5 * 2) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5) * (24 + 2) + WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 + 16 + 24 * 4 + 12, 566 + 22 + (24 + 6), 24, 36
                            )
                        }
                        if (5 * 2 <= i && i < 5 * 3) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5 * 2) * (24 + 2) + WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 + 16 + 24 * 4 + 12, 566 + 22 + (24 + 6) * 2, 24, 36
                            )
                        }
                        if (5 * 3 <= i && i < 5 * 4) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5 * 3) * (24 + 2) + WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 + 16 + 24 * 4 + 12, 566 + 22 + (24 + 6) * 3, 24, 36
                            )
                        }
                        if (5 * 4 <= i && i < 5 * 5) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                (i - 5 * 4) * (24 + 2) + WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 + 16 + 24 * 4 + 12, 566 + 22 + (24 + 6) * 4, 24, 36
                            )
                        }
                    }
                    MakeText("→")
                    for (let i = 0; i < TextModule.TextBox.length; i++) {
                            ctx.drawImage(
                                TextModule.Text_0[1],
                                TextModule.TextBox[i] * 24, 0, 24, 36,
                                i * (24 + 2) + WindowParameter.Window_2.TileSize - WindowParameter.Window_2.TileSize * 0.5 + 16 + 12, 566 + 22 +(30 * Frags.YFrag), 24, 36
                            )
                    }
                }

                //-----------------------------------------------------------------------------------------------
            }
        }
    }
    Debug() {
        const ctx = DebugScreen.getContext("2d");
        ctx.drawImage(
            SystemScreen,
            0, 0, this.NowMap.MapLengthX * Settings.TileSize, this.NowMap.MapLengthY * Settings.TileSize,
            0, 0, Settings.CameraWidth, Settings.CameraHeight)
    }
    DrawGlid()  //マップ上にグリッド補助線を描画　テスト用
    {
        const ctx = SystemScreen.getContext("2d");
        ctx.fillStyle = "rgba(255,0,0,1)"
        for (let i = 0; i < this.NowMap.MapLengthX; i++) {
            for (let j = 0; j < this.NowMap.MapLengthY; j++) {
                ctx.fillRect(i * Settings.TileSize, 0, 1, this.NowMap.MapLengthY * Settings.TileSize);
                ctx.fillRect(0, j * Settings.TileSize, this.NowMap.MapLengthX * Settings.TileSize, 1);
            }
        }
    }
    GetActorPosition() 
    {
        for (let i = 0; i < this.NowActors.length; i++) {
            if (typeof (this.NowActors[i].PositionX) === 'number') {
                this.NowMap.Array[0][(this.NowActors[i].PositionX / Settings.TileSize) + (this.NowActors[i].PositionY / Settings.TileSize * this.NowMap.MapLengthX)] = this.NowActors[i].EventNumber;
                this.NowMap.Array[3][(this.NowActors[i].PositionX / Settings.TileSize) + (this.NowActors[i].PositionY / Settings.TileSize * this.NowMap.MapLengthX)] = this.NowActors[i];
            }
            if (typeof (this.NowActors[i].PositionX) === 'object') {
                for (let j = 0; j < this.NowActors[i].PositionX.length; j++) {
                    this.NowMap.Array[0][(this.NowActors[i].PositionX[j] / Settings.TileSize) + (this.NowActors[i].PositionY[j] / Settings.TileSize * this.NowMap.MapLengthX)] = this.NowActors[i].EventNumber;
                    this.NowMap.Array[3][(this.NowActors[i].PositionX[j] / Settings.TileSize) + (this.NowActors[i].PositionY[j] / Settings.TileSize * this.NowMap.MapLengthX)] = this.NowActors[i];
                }
            }
        }
    }
}

let Map_0 = new MakeMap(
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 10, 3, 2, 3, 2, 3, 2, 3, 2, 11, 18, 18, 18, 18, 18, 18, 18, 10, 2, 2, 3, 3, 2, 3, 2, 2, 2, 11, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 1, 0, 1, 0, 1, 0, 1, 4, 18, 18, 18, 18, 18, 18, 18, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 0, 1, 0, 1, 0, 1, 0, 15, 3, 18, 18, 18, 18, 18, 18, 8, 0, 0, 1, 0, 1, 0, 1, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 18, 18, 18, 18, 18, 18, 9, 0, 1, 0, 1, 0, 1, 0, 1, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 1, 0, 1, 0, 0, 0, 0, 16, 7, 18, 18, 18, 18, 18, 18, 8, 0, 0, 1, 0, 1, 0, 1, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 0, 1, 0, 0, 1, 1, 0, 15, 3, 2, 11, 18, 10, 3, 2, 14, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 5, 18, 9, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 13, 7, 6, 7, 6, 7, 6, 7, 6, 7, 17, 1, 15, 3, 14, 0, 16, 17, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 0, 0, 0, 0, 4, 9, 0, 0, 1, 0, 1, 0, 1, 0, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 10, 2, 2, 3, 2, 3, 2, 11, 10, 3, 14, 1, 16, 6, 6, 7, 12, 8, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 0, 0, 0, 0, 4, 8, 0, 1, 0, 5, 18, 18, 18, 18, 9, 0, 0, 1, 0, 1, 0, 1, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 0, 1, 0, 0, 0, 4, 9, 0, 16, 7, 12, 18, 18, 18, 18, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 0, 1, 0, 0, 4, 8, 0, 5, 18, 18, 18, 18, 18, 18, 13, 7, 6, 7, 6, 7, 6, 7, 6, 7, 12, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 1, 0, 0, 0, 5, 8, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 0, 0, 1, 0, 15, 14, 0, 15, 2, 2, 3, 2, 3, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 2, 11, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 5, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 9, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 13, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 7, 6, 7, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 7, 6, 6, 12, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
        [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 2, 3, 18, 18, 18, 3, 18, 2, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 3, 18, 3, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 2, 18, 18, 18, 2, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 2, 18, 3, 18, 18, 2, 18, 18, 18, 2, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 16, 17, 6, 7, 8, 9, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 12, 13, 14, 15, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 10, 11, 18, 10, 11, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, NaN, 2, 18, 2, 18, 18, 18, 2, 3, 18, 3, 18, 2, 18, 18, 18, 2, 18, 18, 18, 2, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 9, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 14, 15, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "FirstMap", 6, 6, 4, 4, 40, 32);

let Map_1 = new MakeMap(
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 2, 2, 2, 2, 11, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 0, 1, 1, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 6, 6, 17, 0, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 10, 2, 2, 14, 1, 15, 2, 2, 11, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 1, 1, 1, 1, 1, 1, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 1, 1, 1, 1, 1, 1, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 1, 1, 1, 1, 1, 1, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 1, 1, 1, 1, 1, 1, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 8, 1, 1, 1, 1, 1, 1, 1, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 13, 6, 6, 6, 6, 6, 6, 6, 12, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "SecondMap", 6, 6, 4, 4, 40, 32);

let Game = new MakeGame();



window.onload
{
    Game.Change(
        Map_0,
        [ActorData.Global.Creature.Player, ActorData.Local.Map_0.Creature.Friend, ActorData.Local.Map_0.Object.TreasureChest, ActorData.Local.Map_0.Object.TreasureChest_1],
        [ActorData.Global.Creature.Player, ActorData.Local.Map_0.Creature.Friend],
        [ActorData.Local.Map_0.Creature.Friend, ActorData.Local.Map_0.Object.TreasureChest, ActorData.Local.Map_0.Object.TreasureChest_1, ActorData.Local.Map_0.Object.EventTile_0],
        ActorData.Global.Creature.Player,
        ActorData.Global.Creature.Player,
        { BGM: SoundData.BackGroundMusic.BGM_0, SE: [SoundData.SoundEffect.SE_0, SoundData.SoundEffect.SE_1, SoundData.SoundEffect.SE_2] },
    )
    LoadImage();
    CanvasResize();
    setInterval(Loop, (1000 / 120))
    setInterval(Input, (1000 / 120))
    setInterval(PlayCommand, (1000 / 120))
}

function move(Command, HowMany = 1, Who = Game.PlayableActor) {
    if (Command === "+X") //→
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            if (Count % 32 === 0) {
                Game.NowMap.Array[0][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
                Game.NowMap.Array[3][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
            }
            Who.Angle = 1;
            Who.PositionX++;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 50);
            }
        }, 1000 / 1000);
    }
    if (Command === "-X") //←
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            if (Count % 32 === 0) {
                Game.NowMap.Array[0][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
                Game.NowMap.Array[3][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
            }
            Who.Angle = 2;
            Who.PositionX--;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 50);
            }
        }, 1000 / 1000);
    }
    if (Command === "+Y") //↓
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            if (Count % 32 === 0) {
                Game.NowMap.Array[0][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
                Game.NowMap.Array[3][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
            }
            Who.Angle = 0;
            Who.PositionY++;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 50);
            }
        }, 1000 / 1000);
    }
    if (Command === "-Y") //↑
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            if (Count % 32 === 0) {
                Game.NowMap.Array[0][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
                Game.NowMap.Array[3][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
            }
            Who.Angle = 3;
            Who.PositionY--;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 50);
            }
        }, 1000 / 1000);
    }


}
function moveme(Command, HowMany = 1, Who = Game.PlayableActor) {
    if (Command === "+X") //→
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            Who.Angle = 1;
            Who.PositionX++;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 0);
            }
        }, 1000 / 1000);
    }
    if (Command === "-X") //←
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            Who.Angle = 2;
            Who.PositionX--;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 0);
            }
        }, 1000 / 1000);
    }
    if (Command === "+Y") //↓
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            Who.Angle = 0;
            Who.PositionY++;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 0);
            }
        }, 1000 / 1000);
    }
    if (Command === "-Y") //↑
    {
        let Count = 0;
        let A;
        A = setInterval(function () {
            Who.Angle = 3;
            Who.PositionY--;
            Count++;
            if (Count === 32 * HowMany) {
                clearInterval(A);
                setTimeout(() => { InputModule.InputActivate = 0 }, 0);
            }
        }, 1000 / 1000);
    }


}

function Teleport(Who, X, Y) {
    Game.NowMap.Array[0][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;
    Game.NowMap.Array[3][(Who.PositionX / Settings.TileSize) + (Who.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] = 0;

    Who.PositionX = X;
    Who.PositionY = Y;
}

function TransitionCut(Type) {
    if (Type === 0) {
        TransitionParameter.TransitionSwicher = 0;
        let A;
        let B;
        let Count = 0;
        setTimeout(() => {
            A = setInterval(() => {
                TransitionParameter.TransitionKey_0 -= 4;
                Count += 4;
                if (Count === Settings.CameraWidth) clearInterval(A);
            }, 1000 / 300)
            setTimeout(() => {
                B = setInterval(() => {
                    TransitionParameter.TransitionKey_0 += 4;
                    Count -= 4;
                    if (Count === 0) clearInterval(B);
                }, 1000 / 300)
            }, 3000)
        }, 0)
    }

    if (Type === 1) {
        TransitionParameter.TransitionSwicher = 1;
        let A;
        let B;
        let Count = 0;
        setTimeout(() => {
            A = setInterval(() => {
                TransitionParameter.TransitionKey_1 += 0.1;
                Count += 0.1;
                if (Count >= 1) clearInterval(A);
            }, 1000 / 30)
            setTimeout(() => {
                B = setInterval(() => {
                    TransitionParameter.TransitionKey_1 -= 0.1;
                    Count -= 0.1;
                    if (Count <= 0) clearInterval(B);
                }, 1000 / 30)
            }, 1000)
        }, 0)
        TransitionParameter.TransitionKey_1 = 0;
    }
}

function PlayCommand() {
    if (Game.Command.length === 1) {
        Game.Command[0];
    }
    Game.Command.length = 0;
}

function LookPlayer(Who) {
    if (Who.PositionX + Settings.TileSize === Game.PlayableActor.PositionX) Who.Angle = 1;
    if (Who.PositionX - Settings.TileSize === Game.PlayableActor.PositionX) Who.Angle = 2;
    if (Who.PositionY - Settings.TileSize === Game.PlayableActor.PositionY) Who.Angle = 3;
    if (Who.PositionY + Settings.TileSize === Game.PlayableActor.PositionY) Who.Angle = 0;
}

function Input() {
    if (InputModule.InputActivate === 0) {
        if (InputModule.InputMode === 0) {
            if (InputModule.OnEventActivate === 0) {
                if (Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)] !== 0) {
                    InputModule.InputActivate = -1;
                    Game.Command.push(Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX)].EventIndex]());
                    InputModule.OnEventActivate = -1;
                }
            }
            //なんかたまにエラーログ出すけど動いてる、たぶん誤作動でなんでもない場所で『undefinded』を実行して何も起きないからエラー出してると思う。
            //不完全だ　だめ

            if (key[65]) Game.PlayableActor.Angle = 2;
            if (key[65] && Game.NowMap.Array[0][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - 1] === 0 && key[87] === false && key[68] === false && key[83] === false && Game.Command.length === 0) {
                Game.Command.push(moveme("-X"));
                InputModule.InputActivate = -1;

                InputModule.OnEventActivate = 0;
            } //←

            if (key[87]) Game.PlayableActor.Angle = 3;
            if (key[87] && Game.NowMap.Array[0][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - Game.NowMap.MapLengthX] === 0 && key[65] === false && key[68] === false && key[83] === false && Game.Command.length === 0) {
                Game.Command.push(moveme("-Y"));
                InputModule.InputActivate = -1;

                InputModule.OnEventActivate = 0;
            } //↑

            if (key[68]) Game.PlayableActor.Angle = 1;
            if (key[68] && Game.NowMap.Array[0][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + 1] === 0 && key[65] === false && key[87] === false && key[83] === false && Game.Command.length === 0) {
                Game.Command.push(moveme("+X"));
                InputModule.InputActivate = -1;

                InputModule.OnEventActivate = 0;
            }
            //→

            if (key[83]) Game.PlayableActor.Angle = 0;
            if (key[83] && Game.NowMap.Array[0][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + Game.NowMap.MapLengthX] === 0 && key[65] === false && key[68] === false && key[87] === false && Game.Command.length === 0) {
                Game.Command.push(moveme("+Y"));
                InputModule.InputActivate = -1;

                InputModule.OnEventActivate = 0;
            }//↓


            if (key[13] && Game.PlayableActor.Angle == 2 && Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - 1] !== 0) {
                InputModule.InputActivate = -1;
                Game.Command.push(Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - 1].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - 1].EventIndex]());
            }
            if (key[13] && Game.PlayableActor.Angle == 3 && Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - Game.NowMap.MapLengthX] !== 0) {
                InputModule.InputActivate = -1;
                Game.Command.push(Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - Game.NowMap.MapLengthX].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - Game.NowMap.MapLengthX].EventIndex]());
            }
            if (key[13] && Game.PlayableActor.Angle == 1 && Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + 1] !== 0) {
                InputModule.InputActivate = -1;
                Game.Command.push(Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + 1].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + 1].EventIndex]());
            }
            if (key[13] && Game.PlayableActor.Angle == 0 && Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + Game.NowMap.MapLengthX] !== 0) {
                InputModule.InputActivate = -1;
                Game.Command.push(Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + Game.NowMap.MapLengthX].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + Game.NowMap.MapLengthX].EventIndex]());
            }

        }

        if (InputModule.InputMode === 1) {
            if (key[65]) //←
            {
                Frags.XFrag--;
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[87]) //↑
            {
                Frags.YFrag--;
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[68]) //→
            {
                Frags.XFrag++;
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[83]) //↓
            {
                Frags.YFrag++
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }

            if (key[13] && Game.PlayableActor.Angle === 2) //Enter
            {
                Frags.MessageFrag++;
                Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - 1].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - 1].EventIndex]();
                setTimeout(() => { InputModule.InputActivate = 0 }, 500);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[13] && Game.PlayableActor.Angle === 3) //Enter
            {
                Frags.MessageFrag++;
                Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - Game.NowMap.MapLengthX].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) - Game.NowMap.MapLengthX].EventIndex]();
                setTimeout(() => { InputModule.InputActivate = 0 }, 500);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[13] && Game.PlayableActor.Angle === 1) //Enter
            {
                Frags.MessageFrag++;
                Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + 1].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + 1].EventIndex]();
                setTimeout(() => { InputModule.InputActivate = 0 }, 500);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[13] && Game.PlayableActor.Angle === 0) //Enter
            {
                Frags.MessageFrag++;
                Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + Game.NowMap.MapLengthX].MyCommand[Game.NowMap.Array[3][(Game.PlayableActor.PositionX / Settings.TileSize) + (Game.PlayableActor.PositionY / Settings.TileSize * Game.NowMap.MapLengthX) + Game.NowMap.MapLengthX].EventIndex]();
                setTimeout(() => { InputModule.InputActivate = 0 }, 500);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
        }

        if (InputModule.InputMode === 2) {
            if (key[65] && Frags.XFrag > 0) //←
            {
                Frags.XFrag--;
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[87] && Frags.YFrag > 0) //↑
            {
                Frags.YFrag--;
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[68] && Frags.XFrag < Frags.YMax - 1) //→
            {
                Frags.XFrag++;
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
            if (key[83] && Frags.YFrag < Frags.YMax) //↓
            {
                Frags.YFrag++
                setTimeout(() => { InputModule.InputActivate = 0 }, 120);
                setTimeout(() => { InputModule.InputActivate = -1 }, 0);
            }
        }
    }
}

function CanvasResize() {
    SystemScreen = document.createElement("canvas");
    SystemScreen.width = Game.NowMap.MapLengthX * Settings.TileSize;
    SystemScreen.height = Game.NowMap.MapLengthY * Settings.TileSize;

    Camera = document.getElementById("main");
    Camera.width = Settings.CameraWidth;
    Camera.height = Settings.CameraHeight;

    const ctx = Camera.getContext("2d");
    ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = 0;

    DebugScreen = document.getElementById("debug")
    DebugScreen.width = Settings.CameraWidth;
    DebugScreen.height = Settings.CameraHeight;
}

function MakeText(Text,ResetBox = 1) {
    const ctx = Camera.getContext("2d");
    if(ResetBox === 1)
    {
        TextModule.TextBox.length = 0;
    }

    for (let i = 0; i < Text.length; i++) {
        if (Text[i] === "あ") TextModule.TextBox.push(0)
        if (Text[i] === "い") TextModule.TextBox.push(1)
        if (Text[i] === "う") TextModule.TextBox.push(2)
        if (Text[i] === "え") TextModule.TextBox.push(3)
        if (Text[i] === "お") TextModule.TextBox.push(4)
        if (Text[i] === "か") TextModule.TextBox.push(5)
        if (Text[i] === "き") TextModule.TextBox.push(6)
        if (Text[i] === "く") TextModule.TextBox.push(7)
        if (Text[i] === "け") TextModule.TextBox.push(8)
        if (Text[i] === "こ") TextModule.TextBox.push(9)
        if (Text[i] === "さ") TextModule.TextBox.push(10)
        if (Text[i] === "し") TextModule.TextBox.push(11)
        if (Text[i] === "す") TextModule.TextBox.push(12)
        if (Text[i] === "せ") TextModule.TextBox.push(13)
        if (Text[i] === "そ") TextModule.TextBox.push(14)
        if (Text[i] === "た") TextModule.TextBox.push(15)
        if (Text[i] === "ち") TextModule.TextBox.push(16)
        if (Text[i] === "つ") TextModule.TextBox.push(17)
        if (Text[i] === "て") TextModule.TextBox.push(18)
        if (Text[i] === "と") TextModule.TextBox.push(19)
        if (Text[i] === "な") TextModule.TextBox.push(20)
        if (Text[i] === "に") TextModule.TextBox.push(21)
        if (Text[i] === "ぬ") TextModule.TextBox.push(22)
        if (Text[i] === "ね") TextModule.TextBox.push(23)
        if (Text[i] === "の") TextModule.TextBox.push(24)
        if (Text[i] === "は") TextModule.TextBox.push(25)
        if (Text[i] === "ひ") TextModule.TextBox.push(26)
        if (Text[i] === "ふ") TextModule.TextBox.push(27)
        if (Text[i] === "へ") TextModule.TextBox.push(28)
        if (Text[i] === "ほ") TextModule.TextBox.push(29)
        if (Text[i] === "ま") TextModule.TextBox.push(30)
        if (Text[i] === "み") TextModule.TextBox.push(31)
        if (Text[i] === "む") TextModule.TextBox.push(32)
        if (Text[i] === "め") TextModule.TextBox.push(33)
        if (Text[i] === "も") TextModule.TextBox.push(34)
        if (Text[i] === "や") TextModule.TextBox.push(35)
        if (Text[i] === "ゆ") TextModule.TextBox.push(36)
        if (Text[i] === "よ") TextModule.TextBox.push(37)
        if (Text[i] === "ら") TextModule.TextBox.push(38)
        if (Text[i] === "り") TextModule.TextBox.push(39)
        if (Text[i] === "る") TextModule.TextBox.push(40)
        if (Text[i] === "れ") TextModule.TextBox.push(41)
        if (Text[i] === "ろ") TextModule.TextBox.push(42)
        if (Text[i] === "わ") TextModule.TextBox.push(43)
        if (Text[i] === "を") TextModule.TextBox.push(44)
        if (Text[i] === "ん") TextModule.TextBox.push(45)
        if (Text[i] === "が") TextModule.TextBox.push(46)
        if (Text[i] === "ぎ") TextModule.TextBox.push(47)
        if (Text[i] === "ぐ") TextModule.TextBox.push(48)
        if (Text[i] === "げ") TextModule.TextBox.push(49)
        if (Text[i] === "ご") TextModule.TextBox.push(50)
        if (Text[i] === "ざ") TextModule.TextBox.push(51)
        if (Text[i] === "じ") TextModule.TextBox.push(52)
        if (Text[i] === "ず") TextModule.TextBox.push(53)
        if (Text[i] === "ぜ") TextModule.TextBox.push(54)
        if (Text[i] === "ぞ") TextModule.TextBox.push(55)
        if (Text[i] === "だ") TextModule.TextBox.push(56)
        if (Text[i] === "ぢ") TextModule.TextBox.push(57)
        if (Text[i] === "づ") TextModule.TextBox.push(58)
        if (Text[i] === "で") TextModule.TextBox.push(59)
        if (Text[i] === "ど") TextModule.TextBox.push(60)
        if (Text[i] === "ば") TextModule.TextBox.push(61)
        if (Text[i] === "び") TextModule.TextBox.push(62)
        if (Text[i] === "ぶ") TextModule.TextBox.push(63)
        if (Text[i] === "べ") TextModule.TextBox.push(64)
        if (Text[i] === "ぼ") TextModule.TextBox.push(65)
        if (Text[i] === "ぱ") TextModule.TextBox.push(66)
        if (Text[i] === "ぴ") TextModule.TextBox.push(67)
        if (Text[i] === "ぷ") TextModule.TextBox.push(68)
        if (Text[i] === "ぺ") TextModule.TextBox.push(69)
        if (Text[i] === "ぽ") TextModule.TextBox.push(70)
        if (Text[i] === "ぁ") TextModule.TextBox.push(71)
        if (Text[i] === "ぃ") TextModule.TextBox.push(72)
        if (Text[i] === "ぅ") TextModule.TextBox.push(73)
        if (Text[i] === "ぇ") TextModule.TextBox.push(74)
        if (Text[i] === "ぉ") TextModule.TextBox.push(75)
        if (Text[i] === "っ") TextModule.TextBox.push(76)
        if (Text[i] === "ゃ") TextModule.TextBox.push(77)
        if (Text[i] === "ゅ") TextModule.TextBox.push(78)
        if (Text[i] === "ょ") TextModule.TextBox.push(79)
        if (Text[i] === "ア") TextModule.TextBox.push(80)
        if (Text[i] === "イ") TextModule.TextBox.push(81)
        if (Text[i] === "ウ") TextModule.TextBox.push(82)
        if (Text[i] === "エ") TextModule.TextBox.push(83)
        if (Text[i] === "オ") TextModule.TextBox.push(84)
        if (Text[i] === "カ") TextModule.TextBox.push(85)
        if (Text[i] === "キ") TextModule.TextBox.push(86)
        if (Text[i] === "ク") TextModule.TextBox.push(87)
        if (Text[i] === "ケ") TextModule.TextBox.push(88)
        if (Text[i] === "コ") TextModule.TextBox.push(89)
        if (Text[i] === "サ") TextModule.TextBox.push(90)
        if (Text[i] === "シ") TextModule.TextBox.push(91)
        if (Text[i] === "ス") TextModule.TextBox.push(92)
        if (Text[i] === "セ") TextModule.TextBox.push(93)
        if (Text[i] === "ソ") TextModule.TextBox.push(94)
        if (Text[i] === "タ") TextModule.TextBox.push(95)
        if (Text[i] === "チ") TextModule.TextBox.push(96)
        if (Text[i] === "ツ") TextModule.TextBox.push(97)
        if (Text[i] === "テ") TextModule.TextBox.push(98)
        if (Text[i] === "ト") TextModule.TextBox.push(99)
        if (Text[i] === "ナ") TextModule.TextBox.push(100)
        if (Text[i] === "ニ") TextModule.TextBox.push(101)
        if (Text[i] === "ヌ") TextModule.TextBox.push(102)
        if (Text[i] === "ネ") TextModule.TextBox.push(103)
        if (Text[i] === "ノ") TextModule.TextBox.push(104)
        if (Text[i] === "ハ") TextModule.TextBox.push(105)
        if (Text[i] === "ヒ") TextModule.TextBox.push(106)
        if (Text[i] === "フ") TextModule.TextBox.push(107)
        if (Text[i] === "へ") TextModule.TextBox.push(108)
        if (Text[i] === "ホ") TextModule.TextBox.push(109)
        if (Text[i] === "マ") TextModule.TextBox.push(110)
        if (Text[i] === "ミ") TextModule.TextBox.push(111)
        if (Text[i] === "ム") TextModule.TextBox.push(112)
        if (Text[i] === "メ") TextModule.TextBox.push(113)
        if (Text[i] === "モ") TextModule.TextBox.push(114)
        if (Text[i] === "ヤ") TextModule.TextBox.push(115)
        if (Text[i] === "ユ") TextModule.TextBox.push(116)
        if (Text[i] === "ヨ") TextModule.TextBox.push(117)
        if (Text[i] === "ラ") TextModule.TextBox.push(118)
        if (Text[i] === "リ") TextModule.TextBox.push(119)
        if (Text[i] === "ル") TextModule.TextBox.push(120)
        if (Text[i] === "レ") TextModule.TextBox.push(121)
        if (Text[i] === "ロ") TextModule.TextBox.push(122)
        if (Text[i] === "ワ") TextModule.TextBox.push(123)
        if (Text[i] === "ヲ") TextModule.TextBox.push(124)
        if (Text[i] === "ン") TextModule.TextBox.push(125)
        if (Text[i] === "ガ") TextModule.TextBox.push(126)
        if (Text[i] === "ギ") TextModule.TextBox.push(127)
        if (Text[i] === "グ") TextModule.TextBox.push(128)
        if (Text[i] === "ゲ") TextModule.TextBox.push(129)
        if (Text[i] === "ゴ") TextModule.TextBox.push(130)
        if (Text[i] === "ザ") TextModule.TextBox.push(131)
        if (Text[i] === "ジ") TextModule.TextBox.push(132)
        if (Text[i] === "ズ") TextModule.TextBox.push(133)
        if (Text[i] === "ゼ") TextModule.TextBox.push(134)
        if (Text[i] === "ゾ") TextModule.TextBox.push(135)
        if (Text[i] === "ダ") TextModule.TextBox.push(136)
        if (Text[i] === "ヂ") TextModule.TextBox.push(137)
        if (Text[i] === "ヅ") TextModule.TextBox.push(138)
        if (Text[i] === "デ") TextModule.TextBox.push(139)
        if (Text[i] === "ド") TextModule.TextBox.push(140)
        if (Text[i] === "バ") TextModule.TextBox.push(141)
        if (Text[i] === "ビ") TextModule.TextBox.push(142)
        if (Text[i] === "ブ") TextModule.TextBox.push(143)
        if (Text[i] === "ベ") TextModule.TextBox.push(144)
        if (Text[i] === "ボ") TextModule.TextBox.push(145)
        if (Text[i] === "パ") TextModule.TextBox.push(146)
        if (Text[i] === "ピ") TextModule.TextBox.push(147)
        if (Text[i] === "プ") TextModule.TextBox.push(148)
        if (Text[i] === "ペ") TextModule.TextBox.push(149)
        if (Text[i] === "ポ") TextModule.TextBox.push(150)
        if (Text[i] === "ァ") TextModule.TextBox.push(151)
        if (Text[i] === "ィ") TextModule.TextBox.push(152)
        if (Text[i] === "ゥ") TextModule.TextBox.push(153)
        if (Text[i] === "ェ") TextModule.TextBox.push(154)
        if (Text[i] === "ォ") TextModule.TextBox.push(155)
        if (Text[i] === "ッ") TextModule.TextBox.push(156)
        if (Text[i] === "ャ") TextModule.TextBox.push(157)
        if (Text[i] === "ュ") TextModule.TextBox.push(158)
        if (Text[i] === "ョ") TextModule.TextBox.push(159)
        if (Text[i] === "A") TextModule.TextBox.push(160)
        if (Text[i] === "B") TextModule.TextBox.push(161)
        if (Text[i] === "C") TextModule.TextBox.push(162)
        if (Text[i] === "D") TextModule.TextBox.push(163)
        if (Text[i] === "E") TextModule.TextBox.push(164)
        if (Text[i] === "F") TextModule.TextBox.push(165)
        if (Text[i] === "G") TextModule.TextBox.push(166)
        if (Text[i] === "H") TextModule.TextBox.push(167)
        if (Text[i] === "I") TextModule.TextBox.push(168)
        if (Text[i] === "J") TextModule.TextBox.push(169)
        if (Text[i] === "K") TextModule.TextBox.push(170)
        if (Text[i] === "L") TextModule.TextBox.push(171)
        if (Text[i] === "M") TextModule.TextBox.push(172)
        if (Text[i] === "N") TextModule.TextBox.push(173)
        if (Text[i] === "O") TextModule.TextBox.push(174)
        if (Text[i] === "P") TextModule.TextBox.push(175)
        if (Text[i] === "Q") TextModule.TextBox.push(176)
        if (Text[i] === "R") TextModule.TextBox.push(177)
        if (Text[i] === "S") TextModule.TextBox.push(178)
        if (Text[i] === "T") TextModule.TextBox.push(179)
        if (Text[i] === "U") TextModule.TextBox.push(180)
        if (Text[i] === "V") TextModule.TextBox.push(181)
        if (Text[i] === "W") TextModule.TextBox.push(182)
        if (Text[i] === "X") TextModule.TextBox.push(183)
        if (Text[i] === "Y") TextModule.TextBox.push(184)
        if (Text[i] === "Z") TextModule.TextBox.push(185)
        if (Text[i] === "0") TextModule.TextBox.push(186)
        if (Text[i] === "1") TextModule.TextBox.push(187)
        if (Text[i] === "2") TextModule.TextBox.push(188)
        if (Text[i] === "3") TextModule.TextBox.push(189)
        if (Text[i] === "4") TextModule.TextBox.push(190)
        if (Text[i] === "5") TextModule.TextBox.push(191)
        if (Text[i] === "6") TextModule.TextBox.push(192)
        if (Text[i] === "7") TextModule.TextBox.push(193)
        if (Text[i] === "8") TextModule.TextBox.push(194)
        if (Text[i] === "9") TextModule.TextBox.push(195)
        if (Text[i] === "。") TextModule.TextBox.push(196)
        if (Text[i] === "、") TextModule.TextBox.push(197)
        if (Text[i] === "ー") TextModule.TextBox.push(198)
        if (Text[i] === "～") TextModule.TextBox.push(199)
        if (Text[i] === ":") TextModule.TextBox.push(200)
        if (Text[i] === "・") TextModule.TextBox.push(201)
        if (Text[i] === "→") TextModule.TextBox.push(202)
        if (Text[i] === " ") TextModule.TextBox.push(203)
    }
}

function MakePlayerName(Who)
{
    TextModule.TextBox.length = 0;
    MakeText(`${Who.Name}`,0);
    for (let i =  0;i < 5 - Who.Name.length + 5;i++)
    {
        TextModule.TextBox.push(203)
    }

    TextModule.TextBox.push(167,200)
    if(Who.HP < 1)
    {
        TextModule.TextBox.push(203,203,186)
    }
    if(1 <= Who.HP && Who.HP < 10)
    {
        TextModule.TextBox.push(203,203)
        MakeText(`${Who.HP}`,0);
    }
    if(10 <= Who.HP && Who.HP < 100)
    {
        TextModule.TextBox.push(203)
        MakeText(`${Who.HP}`,0);
    }
    if(100 <= Who.HP && Who.HP < 1000)
    {
        MakeText(`${Who.HP}`,0);
    }
    if(Who.HP >= 1000)
    {
        TextModule.TextBox.push(195,195,195)
    }
    
    TextModule.TextBox.push(172,200)
    if(Who.MP < 1)
    {
        TextModule.TextBox.push(203,203,186)
    }
    if(1 <= Who.MP && Who.MP < 10)
    {
        TextModule.TextBox.push(203,203)
        MakeText(`${Who.MP}`,0);
    }
    if(10 <= Who.MP && Who.MP < 100)
    {
        TextModule.TextBox.push(203)
        MakeText(`${Who.MP}`,0);
    }
    if(100 <= Who.MP && Who.MP < 1000)
    {
        MakeText(`${Who.MP}`,0);
    }
    if(Who.MP >= 1000)
    {
        TextModule.TextBox.push(195,195,195)
    }

    TextModule.TextBox.push(171,200)
    if(Who.Lv < 1)
    {
        TextModule.TextBox.push(203,203,186)
    }
    if(1 <= Who.Lv && Who.Lv < 10)
    {
        TextModule.TextBox.push(203,203)
        MakeText(`${Who.MP}`,0);
    }
    if(10 <= Who.Lv && Who.Lv < 100)
    {
        TextModule.TextBox.push(203)
        MakeText(`${Who.MP}`,0);
    }
    if(100 <= Who.Lv && Who.Lv < 1000)
    {
        MakeText(`${Who.MP}`,0);
    }
    if(Who.MP >= 1000)
    {
        TextModule.TextBox.push(195,195,195)
    }

}
//なんかうごかない 少数マスで止まって動けなくなった時の救済関数を作っておいたほうが楽な気がしてきた。
function DecimalsChecker() {
    if (Game.PlayableActor.PositionX % Settings.TileSize > 0 || Game.PlayableActor.PositionY % Settings.TileSize > 0) {
        InputModule.DecimalsCounter++;
    }
    if ((Game.PlayableActor.PositionX % Settings.TileSize) + (Game.PlayableActor.PositionY % Settings.TileSize) === 0) {
        InputModule.DecimalsCounter = 0;
    }
    if (60 < InputModule.DecimalsCounter) {
        Game.PlayableActor.PositionX = Math.round(Game.PlayableActor.PositionX / Settings.TileSize) * Settings.TileSize;
        Game.PlayableActor.PositionY = Math.round(Game.PlayableActor.PositionY / Settings.TileSize) * Settings.TileSize;
        Game.Command.length = 0;
        InputModule.InputActivate = 0;
    }
}


function LoadImage() {
    // MapData
    Map_0.TileImages[0] = new Image; Map_0.TileImages[0].src = "img/EventMapType_0.png";
    Map_0.TileImages[1] = new Image; Map_0.TileImages[1].src = "img/MapType_Wood_0.png";
    Map_0.TileImages[2] = new Image; Map_0.TileImages[2].src = "img/MapType_Wood_1.png";

    Map_1.TileImages[0] = new Image; Map_1.TileImages[0].src = "img/EventMapType_0.png";
    Map_1.TileImages[1] = new Image; Map_1.TileImages[1].src = "img/MapType_Wood_0.png";
    Map_1.TileImages[2] = new Image; Map_1.TileImages[2].src = "img/MapType_Wood_1.png";

    //ActorData
    ActorData.Global.Creature.Player.Image[0] = new Image; ActorData.Global.Creature.Player.Image[0].src = "img/ActorType_Player_0.png"
    ActorData.Local.Map_0.Creature.Friend.Image[0] = new Image; ActorData.Local.Map_0.Creature.Friend.Image[0].src = "img/ActorType_Friend_0.png"
    // ActorData.Local.Map_0.Creature.Mark.Image[0] = new Image; ActorData.Local.Map_0.Creature.Mark.Image[0].src = "img/ActorType_Friend_0.png"
    ActorData.Local.Map_0.Object.TreasureChest.Image[0] = new Image; ActorData.Local.Map_0.Object.TreasureChest.Image[0].src = "img/ActorType_TreasureChest_0.png"
    ActorData.Local.Map_0.Object.TreasureChest_1.Image[0] = new Image; ActorData.Local.Map_0.Object.TreasureChest_1.Image[0].src = "img/ActorType_TreasureChest_1.png"
    ActorData.Local.Map_1.Creature.Hedoro.Image[0] = new Image; ActorData.Local.Map_1.Creature.Hedoro.Image[0].src = "img/Monster_0.png"

    //SoundData
    SoundData.BackGroundMusic.BGM_0[0] = new Audio("sound/bgm/0.mp3");
    SoundData.SoundEffect.SE_0[0] = new Audio("sound/se/0.mp3");
    SoundData.SoundEffect.SE_1[0] = new Audio("sound/se/1.mp3");
    SoundData.SoundEffect.SE_2[0] = new Audio("sound/se/2.mp3");

    //test
    test = new Image; test.src = "img/test.png";
    TextModule.Text_0[0] = new Image; TextModule.Text_0[0].src = "img/Text_0.png";
    TextModule.Text_0[1] = new Image; TextModule.Text_0[1].src = "img/Text_2.png";
    field_0 = new Image; field_0.src = "img/field_0.png";

    //window
    WindowParameter.Window_0.Image[0] = new Image; WindowParameter.Window_0.Image[0].src = "img/MessageWindow_0.png";
    WindowParameter.Window_1.Image[0] = new Image; WindowParameter.Window_1.Image[0].src = "img/MessageWindow_0.png";
    WindowParameter.Window_2.Image[0] = new Image; WindowParameter.Window_2.Image[0].src = "img/MessageWindow_2.png";

    Cursor_0 = new Image; Cursor_0.src = "img/Cursor_0.png";


}

function Loop() {

    Game.Draw();
    // Game.DrawGlid();//テスト用
    Game.Debug();
    Game.GetActorPosition();
    // Game.Test();
    Game.Camera();
    Game.Battle();
    Game.Window();
    Game.Transition();
    DecimalsChecker();
    // Game.PlayCommand();
    // DrawDebugScreen();
    // Game.Draw();
    // Game.PlayCommand();
    // Game.Update();
}



document.onkeydown = function (e) {
    key[e.keyCode] = true;
}
document.onkeyup = function (e) {
    key[e.keyCode] = false;
}