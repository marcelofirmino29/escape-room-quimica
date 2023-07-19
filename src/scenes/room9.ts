import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import { StateMachine } from "../modules/stateMachine";
import { Door } from "../gameObjects/index";
import { StateMachineCollisionEvent } from "../stateMachine/stateMachineCollisionEvent";
import { StateMachineOnClickEvent } from "../stateMachine/stateMachineOnClickEvent";
import { MouseStateAppear } from "../stateMachine/mouseStateAppear";
import { MouseDeadState } from "../stateMachine/mouseDeadState";
import { MouseEnterCageState } from "../stateMachine/mouseEnterCageState";
import { MouseStateWalking } from "../stateMachine/mouseStateWalking";
import { MouseBurstBubbleState } from "../stateMachine/mouseBurstBubbleState";
import { MouseBubbleState } from "../stateMachine/mouseBubbleState";
import { MouseBubbleStartState } from "../stateMachine/mouseBubbleStartState";
import { MouseFallingState } from "../stateMachine/mouseFallingState";
import { MouseComponent } from "../components/mouseComponent";

// Definir camadas de gatilho
const MouseLayer = 8; // 1000 em binário
const PikesLayer = 16; // 10000
const BoxLayer = 32; // 100000
const FanLayer = 64; // 1000000
const CageLayer = 128; // 10000000
// ex: 10100000 (160) significa gaiola ou caixa

export function CreateRoom9(): void {
  // Criar entidade da porta
  const door = new Door(
    resources.models.door9,
    { position: new Vector3(23.2215, 0, 25.0522) },
    resources.sounds.doorSqueek
  );

  // Ouvir evento de clique para alternar o estado da porta
  door.addComponent(
    new OnPointerDown(() => {
      door.openDoor();
    })
  );

  // Criar gaveta para dica
  const drawer = new Entity();
  const drawerClip = new AnimationState("Drawer_Action", { looping: false });
  const drawerAnimator = new Animator();
  drawerAnimator.addClip(drawerClip);
  drawer.addComponent(new GLTFShape("models/room9/Drawer.glb"));
  drawer.addComponent(
    new Transform({ position: new Vector3(20.5487, 0.6, 28.6556) })
  );
  drawer.addComponent(drawerAnimator);
  engine.addEntity(drawer);

  // Criar entidade da sala
  const roomEntity = new Entity();
  // Adicionar forma GLTF
  roomEntity.addComponent(new GLTFShape("models/room9/Puzzle09_Game.glb"));
  // Adicionar e definir transformação
  roomEntity.addComponent(
    new Transform({ position: new Vector3(19.0928, 0, 28.6582) })
  );
  // Criar animador
  const roomAnimator = new Animator();
  // Criar estado de animação para a sala
  const roomAnimation = new AnimationState("Spikes_Action", { looping: true });
  // Adicionar clipe ao animador
  roomAnimator.addClip(roomAnimation);
  // Adicionar animador à entidade
  roomEntity.addComponent(roomAnimator);
  // Reproduzir animação
  roomAnimation.play();
  // Adicionar sala ao motor
  engine.addEntity(roomEntity);

  // Criar rato
  const mouseEntity = new Entity("mouse");
  // Definir rato como filho da sala
  mouseEntity.setParent(roomEntity);
  // Adicionar forma GLTF
  mouseEntity.addComponent(
    new GLTFShape("models/room9/Puzzle09_MouseWill.glb")
  );
  // Criar e adicionar transformação
  const mouseTransform = new Transform();
  mouseEntity.addComponent(mouseTransform);
  // Criar e adicionar componente de rato
  const mouseComponent = new MouseComponent(mouseEntity);
  mouseEntity.addComponent(mouseComponent);

  // Criar máquina de estados
  const mouseStateMachine = new StateMachine();
  engine.addSystem(mouseStateMachine);

  // Adicionar gatilho para o rato
  mouseEntity.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.2, 0.1, 0.2),
        new Vector3(0, 0, 0)
      ),
      MouseLayer,
      PikesLayer | BoxLayer | FanLayer | CageLayer,
      (entityEnter) => {
        let triggerType = StateMachineCollisionEvent.BOXES;
        const triggerLayer = entityEnter.getComponent(
          utils.TriggerComponent
        ).layer;
        if (triggerLayer == PikesLayer) {
          triggerType = StateMachineCollisionEvent.PIKES;
        } else if (triggerLayer == FanLayer) {
          triggerType = StateMachineCollisionEvent.FANS;
        } else if (triggerLayer == CageLayer) {
          triggerType = StateMachineCollisionEvent.CAGE;
        }
        mouseStateMachine.handleEvent(
          new StateMachineCollisionEvent(
            mouseStateMachine,
            entityEnter,
            triggerType
          )
        );
      }
    )
  );

  // Criar estados do rato
  // Estado para o rato aparecer quando o jogo começa
  const mouseStateAppear = new MouseStateAppear(mouseComponent);
  // Estado para quando o rato morre
  const mouseStateDie = new MouseDeadState(mouseComponent);
  // Estado para o rato entrar na gaiola
  const mouseStateEnterCage = new MouseEnterCageState(mouseComponent, () => {
    drawerClip.play();
  });
  // Estado para o rato andar
  const mouseStateWalking = new MouseStateWalking(
    mouseComponent,
    mouseStateDie,
    mouseStateEnterCage
  );
  // Estado para estourar a bolha
  const mouseStateBurstBubble = new MouseBurstBubbleState(mouseComponent);
  // Estado para o rato flutuar dentro da bolha
  const mouseStateBubble = new MouseBubbleState(
    mouseComponent,
    mouseStateBurstBubble
  );
  // Estado para a bolha aparecer e subir
  const mouseStateBubbleAppear = new MouseBubbleStartState(
    mouseComponent,
    mouseStateBubble
  );
  // Estado para o rato cair no chão
  const mouseStateFalling = new MouseFallingState(
    mouseComponent,
    mouseStateDie
  );

  // Ouvir clique no rato
  mouseEntity.addComponent(
    new OnPointerDown((event) => {
      mouseStateMachine.handleEvent(
        new StateMachineOnClickEvent(
          mouseStateMachine,
          mouseStateBubbleAppear,
          mouseStateBurstBubble
        )
      );
    })
  );

  // Criar entidade da bolha
  const bubbleEntity = new Entity();
  // Adicionar transformação
  bubbleEntity.addComponent(
    new Transform({ position: new Vector3(0, 0.1, 0.05) })
  );
  // Criar forma e adicionar como componente
  const bubbleShape = new SphereShape();
  bubbleEntity.addComponent(bubbleShape);
  // Definir como invisível
  bubbleShape.visible = false;
  // Criar material da bolha
  const bubbleMaterial = new Material();
  bubbleMaterial.albedoTexture = new Texture("images/room9/bubbleTexture.png", {
    hasAlpha: false,
  });
  bubbleMaterial.transparencyMode = 2;
  // Adicionar material da bolha
  bubbleEntity.addComponent(bubbleMaterial);
  // Definir bolha como filho do rato
  bubbleEntity.setParent(mouseEntity);
  // Definir bolha para o componente de rato
  mouseComponent.bubble = bubbleEntity;

  // Ouvir clique na bolha
  bubbleEntity.addComponent(
    new OnPointerDown((event) => {
      mouseStateMachine.handleEvent(
        new StateMachineOnClickEvent(
          mouseStateMachine,
          mouseStateBubbleAppear,
          mouseStateBurstBubble
        )
      );
    })
  );

  // Quais estados devem iniciar automaticamente quando um estado termina
  mouseStateAppear.nextState = mouseStateWalking;
  mouseStateBurstBubble.nextState = mouseStateFalling;
  mouseStateFalling.nextState = mouseStateWalking;
  mouseStateDie.nextState = mouseStateAppear;

  // Definir estado inicial
  mouseStateMachine.setState(mouseStateAppear);

  // Carregar clipe de áudio do ventilador
  const audioClipFan = new AudioClip("sounds/fan.mp3");

  // Criar forma do ventilador
  const fanShape = new GLTFShape("models/room9/Fan.glb");

  // Criar matriz de entidades de ventiladores
  const fans: Entity[] = [];

  // Criar transformação dos ventiladores
  const fansTransform: Transform[] = [
    new Transform({
      position: new Vector3(-3.18875, 1.01502, -0.57951),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.6, 0.6, 0.6),
    }),
    new Transform({
      position: new Vector3(-3.18875, 1.01502, 0.02),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.6, 0.6, 0.6),
    }),
    new Transform({
      position: new Vector3(0.169518, 1.01502, -2.94794),
      scale: new Vector3(0.6, 0.6, 0.6),
    }),
    new Transform({
      position: new Vector3(0.75203, 1.01502, -2.94794),
      scale: new Vector3(0.6, 0.6, 0.6),
    }),
    new Transform({
      position: new Vector3(-0.873027, 1.01502, 3.0735),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(0.6, 0.6, 0.6),
    }),
    new Transform({
      position: new Vector3(1.9556, 1.01502, 1.08835),
      rotation: Quaternion.Euler(0, -90, 0),
      scale: new Vector3(0.6, 0.6, 0.6),
    }),
  ];

  fansTransform.forEach((transform) => {
    // Instanciar animação
    const fanAnimation = new AnimationState("Fan_Action", { looping: true });
    // Criar animador
    const fanAnimator = new Animator();
    // Adicionar clipe ao animador
    fanAnimator.addClip(fanAnimation);
    // Criar entidade
    const fanEntity = new Entity();
    // Adicionar forma
    fanEntity.addComponent(fanShape);
    // Adicionar animador
    fanEntity.addComponent(fanAnimator);
    // Adicionar transformação
    fanEntity.addComponent(transform);
    // Adicionar fonte de áudio
    fanEntity.addComponent(new AudioSource(audioClipFan));
    // Definir sala como pai
    fanEntity.setParent(roomEntity);
    // Calcular tamanho e posição do gatilho
    const triggerSize = new Vector3(0.5, 0.5, 2.25).rotate(transform.rotation);
    triggerSize.x = Math.abs(triggerSize.x);
    triggerSize.y = Math.abs(triggerSize.y);
    triggerSize.z = Math.abs(triggerSize.z);
    const triggerPosition = new Vector3(0.2, 0.65, 1.35).rotate(
      transform.rotation
    );

    // Criar componente de gatilho
    const triggerComponent = new utils.TriggerComponent(
      new utils.TriggerBoxShape(triggerSize, triggerPosition),
      FanLayer
    );
    triggerComponent.enabled = false;
    fanEntity.addComponent(triggerComponent);

    // Adicionar componente de alternância
    fanEntity.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (newValue) => {
        if (newValue == utils.ToggleState.On) {
          fanAnimation.play();
          fanEntity.getComponent(AudioSource).playing = true;
          fanEntity.getComponent(AudioSource).loop = true;
          fanEntity.getComponent(AudioSource).volume = 0.3;
          triggerComponent.enabled = true;
        } else {
          fanEntity.getComponent(AudioSource).playing = false;
          fanAnimation.stop();
          triggerComponent.enabled = false;
        }
      })
    );
    // Ouvir clique
    fanEntity.addComponent(
      new OnPointerDown((): void => {
        fanEntity.getComponent(utils.ToggleComponent).toggle();
      })
    );

    // Adicionar entidade ao array
    fans.push(fanEntity);
  });

  // Definir alguns ventiladores como estado ON
  fans[0].getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  fans[3].getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  fans[4].getComponent(utils.ToggleComponent).set(utils.ToggleState.On);

  // Gatilhos da sala
  const roomTriggerEntities: Entity[] = [
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
  ];

  // Criar gatilhos das pontas
  roomTriggerEntities[0].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.06, 0.52),
        new Vector3(0.212483, 1.15162, -0.04)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[1].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.4, 0.52),
        new Vector3(-0.885757, 1.17605, -1.14666)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[2].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.06, 0.52),
        new Vector3(-0.347696, 1.15162, -0.575279)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[3].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.4, 0.52),
        new Vector3(0.729466, 1.17605, 1.08766)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[4].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.06, 0.52),
        new Vector3(-0.347696, 1.15162, 1.08902)
      ),
      PikesLayer
    )
  );

  // Criar gatilhos das caixas
  roomTriggerEntities[5].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(0.212483, 1.04742, -0.04)
      ),
      BoxLayer
    )
  );
  roomTriggerEntities[6].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(-0.347696, 1.04742, -0.575279)
      ),
      BoxLayer
    )
  );
  roomTriggerEntities[7].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(-0.347696, 1.04742, 1.08902)
      ),
      BoxLayer
    )
  );

  // Criar gatilho da gaiola
  const cageTrigger = new Entity();
  cageTrigger.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(1.0331, 1.04742, -0.04)
      ),
      CageLayer
    )
  );
  cageTrigger.setParent(roomEntity);

  // Definir gatilhos como filhos da entidade da sala
  roomTriggerEntities.forEach((triggerEntity) => {
    triggerEntity.setParent(roomEntity);
  });
}
