import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Button, Door, Timer, MovableEntity  } from "../gameObjects/index";
import resources from "../resources";

const openDoorTime = 5;

export function CreateRoom2(): void {
  const door = new Door(
    resources.models.door2,
    { position: new Vector3(24.1, 5.51634, 24.9) },
    resources.sounds.doorSqueak
  );

  const countdownClock = new Timer({
    position: new Vector3(25.1272, 9.51119, 25.2116),
    rotation: Quaternion.Euler(20, 180, 0)
  });
  countdownClock.updateTimeString(openDoorTime);

  const button = new Button(resources.models.squareButton, {
    position: new Vector3(26.3714, 6.89, 26.8936)
  });

  const munaStatue = new MovableEntity(
    resources.models.muna,
    { position: new Vector3(25.14, 5.51634, 26.22),
      rotation: Quaternion.Euler(0, 90, 0) // Rotaciona em 180 graus em torno do eixo Y
    },
    
    resources.sounds.moveObject1,
    new Vector3(0, 0, 4)
  );

  button.addComponent(
    new OnPointerDown((): void => {
      if (!countdownClock.hasComponent(utils.Interval)) {
        button.press();
        door.openDoor();
        munaStatue.getComponent(utils.ToggleComponent).toggle();

        let timeRemaining = openDoorTime;
        countdownClock.addComponent(
          new utils.Interval(1000, (): void => {
            timeRemaining--;

            if (timeRemaining > 0) {
              countdownClock.updateTimeString(timeRemaining);
            } else {
              countdownClock.removeComponent(utils.Interval);

              door.closeDoor();
              munaStatue.getComponent(utils.ToggleComponent).toggle();

              countdownClock.updateTimeString(openDoorTime);
            }
          })
        );
      }
    })
  );
}
