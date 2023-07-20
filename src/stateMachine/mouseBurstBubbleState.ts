import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado de estouro da bolha.
 */
export class MouseBurstBubbleState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  audioClipPop: AudioClip;
  burstParticle: Entity;

  /**
   * Cria uma instância do estado.
   * @param mouseComponent Componente do rato.
   * @param burstParticleSystem Sistema de partículas para usar quando a bolha estourar.
   */
  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
    this.audioClipPop = new AudioClip("sounds/pop.mp3");

    const bubbleParticleMaterial = new Material();
    bubbleParticleMaterial.albedoTexture = new Texture(
      "images/room9/bubbleParticle.png",
      { hasAlpha: true }
    );
    bubbleParticleMaterial.transparencyMode = 2;
    bubbleParticleMaterial.emissiveColor = Color3.White();

    this.burstParticle = new Entity();
    this.burstParticle.addComponent(new PlaneShape());
    this.burstParticle.addComponent(new Billboard());
    this.burstParticle.addComponent(bubbleParticleMaterial);
    this.burstParticle.addComponent(new Transform({ scale: Vector3.Zero() }));
    this.burstParticle.setParent(mouseComponent.mouseEntity.getParent());
  }

  /**
   * Chamado quando o estado começa.
   */
  onStart() {
    // Define o estado como em execução
    this.isStateRunning = true;
    // Escala a bolha para baixo
    this.mouseComponent.bubble.addComponent(
      new utils.ScaleTransformComponent(
        new Vector3(0.5, 0.5, 0.5),
        Vector3.One(),
        0.5,
        (): void => {
          // O estado deve terminar agora
          this.isStateRunning = false;
          // Define a bolha como invisível
          this.mouseComponent.bubble.getComponent(SphereShape).visible = false;
          // Define a posição da partícula
          const particleTransform = this.burstParticle.getComponent(Transform);
          particleTransform.position = this.mouseComponent.transform.position;
          // Reproduz o efeito de partícula
          this.burstParticle.addComponent(
            new utils.ScaleTransformComponent(
              Vector3.Zero(),
              new Vector3(0.4, 0.4, 0.4),
              0.3,
              (): void => {
                particleTransform.scale = Vector3.Zero();
              }
            )
          );
          // Reproduz o som
          const audioSource = new AudioSource(this.audioClipPop);
          this.mouseComponent.mouseEntity.addComponentOrReplace(audioSource);
          audioSource.playOnce();
        }
      )
    );
  }

  /**
   * Chamado quando o estado é atualizado.
   * @param dt Delta.
   * Retorna TRUE para continuar o estado, FALSE para finalizar o estado.
   */
  onUpdateState() {
    // O estado ainda está em execução?
    return this.isStateRunning;
  }
}
