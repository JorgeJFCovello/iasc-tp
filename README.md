# iasc-tp

## IASC Notes
## TP Grupal - IASC 2C2022

1 Contexto
2 Requerimientos
3 Las tecnologías
4 Formato de entrega y evaluación

### 1 Contexto

El objetivo de este TP es diseñar e implementar una aplicación que permita gestionar To do lists de forma colaborativa, en tiempo real y sincronizada entre múltiples dispositivos.

Una To do list es simplemente una lista ordenada de tareas pendientes, que permite a una o más personas organizarse. En nuestro caso, todas las listas pueden ser editadas por múltiples usuarios, y un mismo usuario puede acceder desde varios dispositivos.

Cuando decimos que la aplicación debe funcionar en tiempo real nos referimos a que todas las operaciones que realiza un usuario deberían ocurrir de forma rápida (al menos de forma perceptible para el usuario que las está llevando a cabo), y no depender sustancialmente de las condiciones de la red ni de la cantidad de colaboradores.

### 2 Requerimientos

Vamos a desarrollar una aplicación web que cuente una interfaz para llevar a cabo las operaciones que se detallan a continuación. Toda la operatoria de la aplicación puede ocurrir en memoria (no se pueden persistir datos a disco).

#### Funcionalidades

Los usuarios de la aplicación deben poder:
Crear una To do list
Agregar una tarea a la lista. De cara a los usuarios, una tarea consiste simplemente en un string, aunque si lo consideran necesario pueden agregarle datos adicionales.
Marcar una tarea como resuelta, o desmarcarla en caso de que ya lo esté
Editar una tarea existente
Mover una tarea de una posición de la lista a otra
Eliminar una tarea

#### Múltiples dispositivos

Un usuario puede conectarse a la aplicación desde más de un dispositivo, teniendo acceso a la misma información desde todos ellos. También debe poder desconectarse en todos los dispositivos y, en ese caso, todas las listas que creó o editó deben estar disponibles cuando se vuelva a conectar.

#### Colaboración

Por otro lado, las To do lists pueden ser compartidas entre varios usuarios. Tanto en este caso, como en el de múltiples usuarios accediendo desde distintos dispositivos, es importante que el estado de las listas no diverja entre los mismos. Esto quiere decir que, después de comunicar todos los cambios a todos los dispositivos, dichos dispositivos deberían mostrar el mismo estado (si bien es aceptable que, hasta que eso ocurra, cada dispositivo tenga información diferente o, mejor dicho, incompleta).

#### Redundancia de datos y tolerancia a fallos

Tener un sólo lugar que actúe como “fuente de verdad” de la información de una To do list es un riesgo, ya que dependemos de que esté siempre disponible, y que todos los demás componentes de la aplicación puedan acceder a dichos datos. Por lo tanto, si queremos tener una aplicación que sea tolerante a fallos (tanto de componentes como en la comunicación entre los mismos), vamos a requerir que no exista una única fuente de verdad en el sistema o que su ausencia no impida que otros dispositivos puedan seguir editando dichas listas.

#### Modo offline (opcional)

En caso de que un cliente no cuente con acceso constante a Internet, contar con un modo offline permite que los clientes puedan hacer cambios en su copia local, y eventualmente sincronizarlos cuando vuelvan a tener conexión. Para esto es importante definir cómo se van a resolver los conflictos que surjan al momento de “mergear” la copia local con la online.

#### No-requerimientos

En esta primera versión no se tendrán en cuenta cuestiones de seguridad asociadas a la comunicación a través de la red. Tampoco nos interesa en este momento tener un sistema complejo de manejo de usuarios y de permisos; sólo nos importa poder distinguir a un usuario de otro, y asumimos que todas las listas pueden ser accedidas y editadas por cualquier usuario.

### 3 Tecnologías

Se podrá utilizar cualquier tecnología que aplique alguno de los siguientes conceptos vistos en la cursada:
- Paso de mensajes basado en actores
- Continuaciones explícitas (CPS)
- Promises
- Memoria transaccional
- Corrutinas

Obviamente, lo más simple es basarse en Elixir/OTP, Haskell, o Node.js, que son las tecnologías principales que vimos en la materia. 

Otras opciones son tecnologías basadas en Scala/Akka, Go, Clojure y Rust, pero ahí les podremos dar menos soporte.

A su vez, si les interesa meterse a investigar un poco, hay algunas tecnologías o herramientas que, si bien no vimos durante la cursada, pueden serles de utilidad a la hora de encarar el desarrollo del trabajo práctico (aunque ninguna es imprescindible para cumplir con los requerimientos del TP):
- CRDTs (Conflict-free replicated data types)
- Push notifications
- Websockets
- Server-sent events
Si tienen consultas respecto a alguna de estas tecnologías, pueden ponerse en contacto con el tutor de su grupo.

### 4 Formato de entrega y evaluación

Como parte del TP se evaluará que:
- El sistema cumpla con los requerimientos planteados
- La arquitectura sea distribuida (no se aceptará que toda la aplicación requiera necesariamente correr en una única computadora)
- Puedan argumentar cómo se distribuyen los datos en la aplicación, así como las estrategias para sincronizarlos	
- Por ejemplo: ¿cuál es la fuente de verdad de los datos de una To do list? ¿Un servidor? ¿Un cliente? ¿Varios clientes? ¿Cómo se comunican las actualizaciones que se hacen a las listas?
- Detecten problemas de concurrencia, y definan estrategias para resolverlos.
- Por ejemplo: ¿qué pasa si un usuario quiere editar un mensaje que otro ya borró?
- Justifiquen el/los modelo/s de concurrencia utilizados, identificando ventajas y desventajas para resolver las problemáticas del TP.
- Definan el nivel de consistencia requerido al aplicar y propagar cambios entre distintos dispositivos, entendiendo cómo esto impacta en la disponibilidad (y performance) de la aplicación, y también en la tolerancia a errores (tanto de componentes, como en la comunicación entre los mismos).

#### El trabajo práctico tendrá dos hitos:
Un checkpoint, donde deberán presentar el avance de la implementación hasta ese momento, junto con la propuesta de arquitectura del sistema completo a alto nivel, considerando los requerimientos funcionales y no funcionales (no hace falta entregar una implementación de esto último, alcanza con tener diagramas que permitan entender la propuesta).
Una entrega final con el sistema terminado. No es obligatoria la construcción de casos de prueba automatizados, pero constituye un gran plus. Además, la entrega debe contar con un documento que describa la arquitectura de la resolución propuesta, el cual se deberá entregar junto con la implementación.
