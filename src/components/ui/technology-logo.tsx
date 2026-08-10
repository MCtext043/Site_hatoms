import type { IconType } from 'react-icons'
import {
  SiAndroid, SiArduino, SiAuth0, SiCelery, SiDocker, SiDjango, SiEspressif, SiFastapi, SiFlask, SiFramer,
  SiGithubactions, SiGrafana, SiGreensock, SiHuggingface, SiJetpackcompose, SiJsonwebtokens, SiJunit5,
  SiKotlin, SiKubernetes, SiLangchain, SiLinux, SiMinio, SiMlflow, SiMqtt, SiNextdotjs, SiNginx, SiNumpy,
  SiOnnx, SiOpencv, SiPandas, SiPostgresql, SiPostman, SiPrometheus, SiPytorch, SiPytest,
  SiQt, SiRabbitmq, SiRaspberrypi, SiReact, SiReactquery, SiRedis, SiRos, SiScikitlearn, SiSentry,
  SiShadcnui, SiSocketdotio, SiSqlalchemy, SiSwift, SiTailwindcss, SiThreedotjs, SiTypescript, SiVite,
  SiVitest, SiYandexcloud,
} from 'react-icons/si'
import { Boxes, Braces, Code2, Database, GitFork, Network, Nfc, Radio, ShieldCheck } from 'lucide-react'

const simpleIconByTechnology: Record<string, IconType> = {
  React: SiReact, TypeScript: SiTypescript, Vite: SiVite, 'Tailwind CSS': SiTailwindcss, 'Next.js': SiNextdotjs, 'TanStack Query': SiReactquery, 'shadcn/ui': SiShadcnui, 'Framer Motion': SiFramer, GSAP: SiGreensock, 'Three.js': SiThreedotjs,
  FastAPI: SiFastapi, Flask: SiFlask, Django: SiDjango, SQLAlchemy: SiSqlalchemy, PostgreSQL: SiPostgresql, Redis: SiRedis, RabbitMQ: SiRabbitmq, Celery: SiCelery, WebSocket: SiSocketdotio, JWT: SiJsonwebtokens, 'OAuth 2.0': SiAuth0,
  Kotlin: SiKotlin, Swift: SiSwift, 'Jetpack Compose': SiJetpackcompose, Room: SiAndroid, Hilt: SiAndroid,
  PyTorch: SiPytorch, 'Scikit-learn': SiScikitlearn, OpenCV: SiOpencv, Pandas: SiPandas, NumPy: SiNumpy, 'Hugging Face': SiHuggingface, LangChain: SiLangchain, ONNX: SiOnnx, MLflow: SiMlflow,
  Docker: SiDocker, Kubernetes: SiKubernetes, Nginx: SiNginx, 'GitHub Actions': SiGithubactions, Linux: SiLinux, Prometheus: SiPrometheus, Grafana: SiGrafana, Sentry: SiSentry,
  Pytest: SiPytest, Vitest: SiVitest, JUnit: SiJunit5, Postman: SiPostman,
  PyQt6: SiQt, 'Yandex Cloud': SiYandexcloud, MinIO: SiMinio, ESP32: SiEspressif, Arduino: SiArduino, 'Raspberry Pi': SiRaspberrypi, 'ROS 2': SiRos, MQTT: SiMqtt,
}

const fallbackByTechnology = {
  'REST API': Network,
  Coroutines: Code2,
  BLE: Radio,
  NFC: Nfc,
  MVVM: Boxes,
  'Dependency Injection': GitFork,
  'CI/CD': GitFork,
  'Clean Architecture': Boxes,
  SOLID: Braces,
  Microservices: Boxes,
  'Event-driven architecture': Radio,
  'Repository Pattern': Database,
  Caching: Database,
  'Message Brokers': Network,
} as const

export function TechnologyLogo({ name }: { name: string }) {
  const Icon = simpleIconByTechnology[name]
  const FallbackIcon = fallbackByTechnology[name as keyof typeof fallbackByTechnology]

  if (Icon) return <Icon aria-hidden="true" />
  if (FallbackIcon) return <FallbackIcon aria-hidden="true" />
  return <ShieldCheck aria-hidden="true" />
}
