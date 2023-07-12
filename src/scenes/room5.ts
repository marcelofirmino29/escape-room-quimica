import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import { Door, Model, NumPadLock, RotatableEntity, MovableEntity } from "../gameObjects/index";
import { ImageHint, Keypad } from "../ui/index";

export function CreateRoom5(gameCanvas: UICanvas): void {
  const door = new Door(
    resources.models.door5,
    {
      position: new Vector3(19.5141, 5.54709, 25.676)
    },
    resources.sounds.doorSqueak
  );

  // Add a painting with the first hint
  const painting = new Model(resources.models.pictureFrame, {
    position: new Vector3(22.2283, 7.60325, 20.9326)
  });

  const paintingHint = new ImageHint(gameCanvas, resources.textures.fernHint);
  paintingHint.container.visible = false;
  painting.addComponent(
    new OnPointerDown((): void => {
      paintingHint.container.visible = true;
    })
  );

  // And a carpet which covers a postit note
  const carpet = new RotatableEntity(
    resources.models.carpet,
    {
      position: new Vector3(20.7079, 5.50579, 24.6273),
      rotation: Quaternion.Identity
    },
    undefined,
    Quaternion.Euler(0, -10, 0)
  );
  carpet.addComponent(
    new OnPointerDown((): void => {
      carpet.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // The postit contains the second hint
  const postit = new Model(resources.models.postit, {
    position: new Vector3(21.571, 5.50857, 25.9534)
  });

  const postitHint = new ImageHint(gameCanvas, resources.textures.postitHint);
  postitHint.container.visible = false;
  postit.addComponent(
    new OnPointerDown
    ((): void => {
      postitHint.container.visible = true;
    })
  );

  // Prep the keypad UI
  const keypad = new Keypad(gameCanvas);
  keypad.container.visible = false;

  // Add a panel which opens the UI when clicked
  const numPadLock = new NumPadLock(resources.models.numpad1);
  numPadLock.addComponent(
    new OnPointerDown((): void => {
      keypad.container.visible = true;
    })
  );

  const bookshelf = new MovableEntity(
    resources.models.door4,
    new Transform({
      position: new Vector3(18.8, 5.4, 23.65),
      rotation: Quaternion.Euler(0, 90, 0) // Rotaciona em 180 graus em torno do eixo Y
    }),
    resources.sounds.moveObject1,
    new Vector3(0, 0, -4),
    3
  );
  

  // Wire up the keypad logic
  let currentInput = "";
  keypad.onInput = (value: number): void => {
    currentInput += value;
    keypad.display(currentInput);
    numPadLock.playButtonPressed();
  };
  keypad.onReset = (): void => {
    currentInput = "";
    keypad.display(currentInput);
    numPadLock.playButtonPressed();
  };
  keypad.onSubmit = (): void => {
    if (currentInput == "155") {
      // Correct!
      keypad.display("OK!", Color4.Green());
      numPadLock.playAccessGranted();
      numPadLock.addComponentOrReplace(
        new utils.ExpireIn(2000, (): void => {
          keypad.container.visible = false;
          door.openDoor();
          bookshelf.getComponent(utils.ToggleComponent).toggle();
        })
      );
    } else {
      // The password is incorrect
      keypad.display("Err", Color4.Red());
      numPadLock.playAccessDenied();
      currentInput = "";
    }
  };
}