import utils from "../../node_modules/decentraland-ecs-utils/index";

@Component("mouseFollowPathComponent")
export class MouseFollowPathComponent {
  private startDelay: number;
  private idleTime: number;
  private path: Vector3[];
  private movingTime: number;

  private currentTime: number;
  private isInIdleTime: boolean;

  constructor(
    startDelay: number,
    idleTime: number,
    path: Vector3[],
    movingTime: number
  ) {
    this.startDelay = startDelay;
    this.idleTime = idleTime;
    this.path = path;
    this.movingTime = movingTime;

    this.currentTime = idleTime;
    this.isInIdleTime = true;
  }

  update(dt: number, mouseEntity: IEntity) {
    // Verifica se está esperando o início
    if (this.startDelay > 0) {
      this.startDelay -= dt;
    }
    // Quando o mouse está em repouso
    else if (this.isInIdleTime) {
      // Aumenta o tempo no estado de repouso
      this.currentTime += dt;
      // Quando o tempo de repouso é atingido
      if (this.currentTime >= this.idleTime) {
        // Não estamos mais em estado de repouso
        this.isInIdleTime = false;

        // Gira o mouse para olhar para o próximo ponto no caminho
        mouseEntity.getComponent(Transform).lookAt(this.path[1]);
        // Adiciona componente para seguir o caminho
        mouseEntity.addComponentOrReplace(
          new utils.FollowPathComponent(
            this.path,
            this.movingTime,
            () => {
              // Quando o caminho é concluído, redefinimos as variáveis do mouse
              this.isInIdleTime = true;
              this.currentTime = 0;
              // Definimos o mouse para ir na direção oposta na próxima vez
              this.path.reverse();
            },
            (currentPoint, nextPoint) => {
              // Quando chegamos a um novo ponto no caminho, giramos o mouse para olhar para o próximo ponto
              mouseEntity.getComponent(Transform).lookAt(nextPoint);
            }
          )
        );
      }
    }
  }
}
