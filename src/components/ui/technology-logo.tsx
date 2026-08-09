import type { IconType } from 'react-icons'
import * as SimpleIcons from 'react-icons/si'
import { Boxes, Braces, Code2, Database, GitFork, Network, Nfc, Radio, ShieldCheck, TestTube2 } from 'lucide-react'

const simpleIconByTechnology: Record<string, string> = {
  React: 'SiReact', TypeScript: 'SiTypescript', Vite: 'SiVite', 'Tailwind CSS': 'SiTailwindcss', 'Next.js': 'SiNextdotjs', 'TanStack Query': 'SiReactquery', Zustand: 'SiZustand', 'shadcn/ui': 'SiShadcnui', 'Framer Motion': 'SiFramer', GSAP: 'SiGreensock', 'Three.js': 'SiThreedotjs',
  FastAPI: 'SiFastapi', Flask: 'SiFlask', Django: 'SiDjango', SQLAlchemy: 'SiSqlalchemy', PostgreSQL: 'SiPostgresql', Redis: 'SiRedis', RabbitMQ: 'SiRabbitmq', Celery: 'SiCelery', WebSocket: 'SiSocketdotio', JWT: 'SiJsonwebtokens', 'OAuth 2.0': 'SiAuth0',
  Kotlin: 'SiKotlin', Swift: 'SiSwift', 'Jetpack Compose': 'SiJetpackcompose', Retrofit: 'SiRetrofit', Room: 'SiAndroid', Hilt: 'SiAndroid',
  PyTorch: 'SiPytorch', 'Scikit-learn': 'SiScikitlearn', OpenCV: 'SiOpencv', Pandas: 'SiPandas', NumPy: 'SiNumpy', 'Hugging Face': 'SiHuggingface', LangChain: 'SiLangchain', ONNX: 'SiOnnx', MLflow: 'SiMlflow',
  Docker: 'SiDocker', Kubernetes: 'SiKubernetes', Nginx: 'SiNginx', 'GitHub Actions': 'SiGithubactions', Linux: 'SiLinux', Prometheus: 'SiPrometheus', Grafana: 'SiGrafana', Sentry: 'SiSentry',
  Pytest: 'SiPytest', Vitest: 'SiVitest', Playwright: 'SiPlaywright', JUnit: 'SiJunit5', Postman: 'SiPostman', Testcontainers: 'SiTestcontainers',
  PyQt6: 'SiQt', 'Yandex Cloud': 'SiYandexcloud', MinIO: 'SiMinio', ESP32: 'SiEspressif', Arduino: 'SiArduino', 'Raspberry Pi': 'SiRaspberrypi', 'ROS 2': 'SiRos', MQTT: 'SiMqtt',
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
  const iconName = simpleIconByTechnology[name]
  const Icon = iconName ? SimpleIcons[iconName as keyof typeof SimpleIcons] as unknown as IconType : null
  const FallbackIcon = fallbackByTechnology[name as keyof typeof fallbackByTechnology]

  if (Icon) return <Icon aria-hidden="true" />
  if (FallbackIcon) return <FallbackIcon aria-hidden="true" />
  return <ShieldCheck aria-hidden="true" />
}
