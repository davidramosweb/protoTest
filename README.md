# LeHibou gRPC Proto Files Repository

## Description

Repository with all the proto files used for the gRPC transporter used for communication between microservices in LeHibou applications.

## Installation

```bash
$ npm i
```

## Usage

The `.proto` files should be created in the `/proto` folder and once added, run the build command. This will transform the `.proto` files into idiomatic and strongly typed TypeScript files.
### Build

Once the `.proto` files have been added, we can proceed to run the build command to generate the TypeScript files.

```bash
$ npm run build
```

### Naming convention

For each service in your `.proto` file we generate two `interfaces` on to implement in your nestjs `controller` and one for the `client`.

The name of the `controller` interface is base on the name of the service inside the `.proto`.

If we have to following `.proto` file:

```protobuf
syntax = "proto3";

package hero;

service HeroService {
    rpc FindOneHero (HeroById) returns (Hero) {}
    rpc FindOneVillain (VillainById) returns (Villain) {}
    rpc FindManyVillain (stream VillainById) returns (stream Villain) {}
}
```

The controller interface name would be `HeroServiceController`.
The client interface name would `HeroServiceClient`.

### Implementation

To implement the typescript file in your `nestjs` project you need to add the `controller` interface to your controller. We also generate a `decorator` for you controller. For example: `HeroServiceControllerMethods`, when you apply this to your controller we add all the method decorators you normally should do but doing it this way is safer.

For the client we simply pass the `client` interface to the `client.getService<?>();` (see below).

> Note: Based on the `.proto` we'll generate a `const` for example `HERO_PACKAGE_NAME` and `HERO_SERVICE_NAME` this way your code breaks if you change your package or service name. (It's safer to have compiler errors than runtime errors)

##### Controller

```typescript
import { HeroById, Hero, HeroServiceController, VillainById, Villain, HeroServiceControllerMethods } from 'lehibou-grpc';

@Controller('hero')
// Generated decorator that applies all the @GrpcMethod and @GrpcStreamMethod to the right methods
@HeroServiceControllerMethods()
export class HeroController implements HeroServiceController {
  private readonly heroes: Hero[] = [
    { id: 1, name: 'Stephenh' },
    { id: 2, name: 'Iangregsondev' },
  ];

  private readonly villains: Villain[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];

  async findOneHero(data: HeroById): Promise<Hero> {
    return this.heroes.find(({ id }) => id === data.id)!;
  }

  async findOneVillain(data: VillainById): Promise<Villain> {
    return this.villains.find(({ id }) => id === data.id)!;
  }

  findManyVillain(request: Observable<VillainById>): Observable<Villain> {
    const hero$ = new Subject<Villain>();

    const onNext = (villainById: VillainById) => {
      const item = this.villains.find(({ id }) => id === villainById.id);
      hero$.next(item);
    };
    const onComplete = () => hero$.complete();
    request.subscribe(onNext, null, onComplete);

    return hero$.asObservable();
  }
}
```

##### Client

```typescript
import { HeroById, Hero, HeroServiceController, HeroesService, HERO_SERVICE_NAME, HERO_PACKAGE_NAME } from 'lehibou-grpc';

@Injectable()
export class AppService implements OnModuleInit {
  private heroesService: HeroesService;

  constructor(@Inject(HERO_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>(HERO_SERVICE_NAME);
  }

  getHero(): Observable<Hero> {
    return this.heroesService.findOne({ id: 1 });
  }
}
```

### Installing the package

Install the package in the microservices applications with the following command.

```bash
$ npm i --save git@gitlab.com:lehibou-v2/lehibou-grpc.git
```

We also need to modify the `nest-cli.json` file, we add the `assets` property that allows us to distribute non-TypeScript files, and `watchAssets` - to turn on watching all non-TypeScript assets. In our case, we want `.proto` files to be automatically copied to the `dist` folder.

```bash
{
  "compilerOptions": {
    "assets": [
      "**/*.proto",
      {
        "include": "../node_modules/lehibou-grpc/proto/*.proto"
      }
    ],
    "watchAssets": true
  }
}
```

#### MicroserviceOptions integration

Now we can use the protoPath `./lehibou-grpc/proto/hero.proto` in our options object passed to the createMicroservice() method

```bash
{
  transport: Transport.GRPC,
  options: {
    package: 'hero',
    protoPath: join(__dirname, './lehibou-grpc/proto/hero.proto'),
  },
}
```
