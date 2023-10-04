import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

import Earth from "../index";
import Planet from "./Planet";
import Lights from "./Lights";
import Airplane from "./Airplane";

export default class Components {
  earth;
  scene;
  camera;
  time;
  planet;
  airplane;
  lights;

  camPosition;
  camPositionLookAt;
  camNewPosition;
  camNewPositionLookAt;
  camCurrentPosition;
  camCurrentPositionLookAt;

  playerGroup;
  playerGroupXAxis;
  playerGroupYAxis;
  playerGroupZAxis;
  forwardAxis;
  turnAxis;
  upRightAxis;
  oldPlayerPosition;
  newPlayerPosition;
  upRightAngle;
  frontRightAngle;
  angleBetweenPositions;
  walkVelocity;
  walkVelocityAndDir;
  playerPlate;

  gForce;
  physicsWorld;
  defaultMaterial;
  airplaneMaterial;
  defaultContactMaterial;
  airplaneDefaultContactMaterial;
  cannonDebugger;

  testCubeBody;
  testCubeGravityDirection;

  keyMap: { [x: string]: boolean };

  constructor() {
    this.earth = new Earth();
    this.scene = this.earth.scene;
    this.camera = this.earth.camera;
    this.time = this.earth.time;

    /**
     * Physics setup
     */
    this.gForce = 5;
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.allowSleep = true;
    this.physicsWorld.gravity.set(0, -this.gForce, 0);

    // Set physics contact materials
    this.defaultMaterial = new CANNON.Material("default");
    this.airplaneMaterial = new CANNON.Material("astronaut");
    // Contact params between default and default
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.7,
        restitution: 0.5,
      }
    );
    // Contact params between astronaut and default
    this.airplaneDefaultContactMaterial = new CANNON.ContactMaterial(
      this.airplaneMaterial,
      this.defaultMaterial,
      {
        friction: 2,
        restitution: 0,
      }
    );

    this.physicsWorld.addContactMaterial(this.defaultContactMaterial);
    this.physicsWorld.addContactMaterial(this.airplaneDefaultContactMaterial);

    //Set up Models
    this.planet = new Planet();
    this.planet.setPlanetPhysics(this.physicsWorld, this.defaultMaterial);

    this.airplane = new Airplane();

    this.lights = new Lights();

    //Set up Game play

    this.testCubeBody = new CANNON.Body({
      mass: 10,
    });
    this.testCubeBody.addShape(new CANNON.Box(new CANNON.Vec3(2, 2, 2)));
    this.testCubeBody.position.set(0, 100 + 30, 0);
    this.testCubeGravityDirection = new CANNON.Vec3();
    this.physicsWorld.addBody(this.testCubeBody);
    //@ts-expect-error no ts declaration
    this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld, {
      onInit(body, mesh) {
        mesh.visible = false;
        body;
        document.addEventListener("keydown", (event) => {
          if (event.key === "k") {
            mesh.visible = !mesh.visible;
          }
        });
      },
    });

    /**
     * Camera basic set up
     */
    this.camPosition = this.airplane.camPosition;
    this.camPositionLookAt = this.airplane.camPositionLookAt;

    this.camNewPosition = new THREE.Vector3();
    this.camNewPositionLookAt = new THREE.Vector3();
    this.camCurrentPosition = new THREE.Vector3();
    this.camCurrentPositionLookAt = new THREE.Vector3();

    /**
     * Set up basic controls for controlling the Airplane
     */
    this.playerGroup = new THREE.Object3D();

    this.playerGroupXAxis = new THREE.Vector3();
    this.playerGroupYAxis = new THREE.Vector3();
    this.playerGroupZAxis = new THREE.Vector3();

    this.forwardAxis = new THREE.Vector3(1, 0, 0);
    this.turnAxis = new THREE.Vector3(0, 1, 0);
    this.upRightAxis = new THREE.Vector3(0, 0, 1);
    this.oldPlayerPosition = new THREE.Vector3(0, 1, 0);
    this.newPlayerPosition = new THREE.Vector3();
    this.upRightAngle = 0;
    this.frontRightAngle = 0;
    this.angleBetweenPositions = 0;

    this.walkVelocity = new CANNON.Vec3(0, 0, 3.5);
    this.walkVelocityAndDir = new CANNON.Vec3(0, 0, 0);
    this.playerPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,

        opacity: 0,
      })
    );
    this.playerPlate.position.y = 100 + 30;
    this.playerPlate.rotation.x = -Math.PI / 2;
    this.playerPlate.renderOrder = 0.5;
    this.playerGroup.add(this.playerPlate);
    this.scene?.add(this.playerGroup);

    //Set keyMap

    this.keyMap = {};
    document.addEventListener("keydown", (e) => {
      this.keyMap[e.code] = e.type === "keydown";
    });
    document.addEventListener("keyup", (e) => {
      this.keyMap[e.code] = e.type === "keydown";
    });
  }

  update() {
    this.planet.update();
    this.airplane.update();
    this.physicsWorld.fixedStep();
    this.cannonDebugger.update();

    this.testCubeBody.force = this.applyGForce(
      this.testCubeGravityDirection,
      this.testCubeBody.position,
      this.testCubeBody.force,
      this.testCubeBody.mass
    );

    //@ts-expect-error accept
    this.testCubeBody.quaternion.copy(this.playerGroup.quaternion);

    this.testCubeBody.quaternion.vmult(
      this.walkVelocity.scale(1),
      this.walkVelocityAndDir
    );

    if (this.testCubeBody.velocity.length() > 3.5) {
      this.testCubeBody.velocity.copy(this.testCubeBody.velocity);
    } else {
      this.testCubeBody.velocity.copy(this.walkVelocityAndDir);
    }

    this.airplane.setRotateFlag(undefined);
    // Turning left
    if (this.keyMap["KeyA"] || this.keyMap["ArrowLeft"]) {
      this.playerGroup.rotateOnAxis(this.turnAxis, 0.004 * 6);
      this.airplane.setRotateFlag(true);
    }
    // Turning right
    if (this.keyMap["KeyD"] || this.keyMap["ArrowRight"]) {
      this.playerGroup.rotateOnAxis(this.turnAxis, -0.004 * 6);
      this.airplane.setRotateFlag(false);
    }

    //@ts-expect-error accept
    this.newPlayerPosition.copy(this.testCubeGravityDirection.scale(-1));
    this.angleBetweenPositions = this.newPlayerPosition.angleTo(
      this.oldPlayerPosition
    );

    //Camera update

    if (this.angleBetweenPositions > 0) {
      // If there is any position changes, get axises of playerGroup for latter update
      this.playerGroup.getWorldDirection(this.playerGroupZAxis);
      this.playerGroupYAxis
        .copy(this.playerGroup.up)
        .applyMatrix4(this.playerGroup.matrix)
        .normalize();
      this.playerGroupXAxis.crossVectors(
        this.playerGroupZAxis,
        this.playerGroupYAxis
      );

      this.upRightAngle =
        Math.PI / 2 - this.newPlayerPosition.angleTo(this.playerGroupXAxis);
      this.frontRightAngle =
        Math.PI / 2 - this.newPlayerPosition.angleTo(this.playerGroupZAxis);

      this.playerGroup.rotateOnAxis(this.upRightAxis, this.upRightAngle);
      this.playerGroup.rotateOnAxis(this.forwardAxis, this.frontRightAngle);

      this.oldPlayerPosition.copy(this.newPlayerPosition);
    }
    //@ts-expect-error except
    this.airplane.instance.position.copy(this.testCubeBody.position);
    //@ts-expect-error except
    this.airplane.instance.quaternion.copy(this.testCubeBody.quaternion);

    // Turning left
    if (this.keyMap["KeyA"] || this.keyMap["ArrowLeft"]) {
      this.airplane.instance.rotateZ(-0.05 * Math.PI);
    }
    // Turning right
    if (this.keyMap["KeyD"] || this.keyMap["ArrowRight"]) {
      this.airplane.instance.rotateZ(0.05 * Math.PI);
    }

    this.camNewPosition.copy(
      this.camPosition.getWorldPosition(new THREE.Vector3())
    );
    this.camNewPositionLookAt.copy(
      this.camPositionLookAt.getWorldPosition(new THREE.Vector3())
    );

    //@ts-expect-error hhh
    this.camCurrentPosition.lerp(this.camNewPosition, this.time?.delta / 500);
    this.camCurrentPositionLookAt.lerp(
      this.camNewPositionLookAt,
      //@ts-expect-error hhh
      this.time?.delta / 500
    );

    this.camera?.instance.position.copy(this.camCurrentPosition);
    this.camera?.instance.lookAt(this.camCurrentPositionLookAt);
    //@ts-expect-error hhh
    this.camera?.instance.up.copy(this.testCubeGravityDirection.scale(-1));
  }

  applyGForce(
    gForceDirection: CANNON.Vec3,
    bodyPosition: CANNON.Vec3,
    bodyForce: CANNON.Vec3,
    bodyMass: number
  ) {
    gForceDirection.set(-bodyPosition.x, -bodyPosition.y, -bodyPosition.z);
    gForceDirection.normalize();
    gForceDirection.scale(this.gForce, bodyForce);

    bodyForce.y += bodyMass * this.gForce;

    return bodyForce;
  }
}
