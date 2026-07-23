import type { IconType } from 'react-icons'
import { Cloud } from 'lucide-react'
import {
  SiCelery,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGithubactions,
  SiLinux,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiRabbitmq,
  SiReact,
  SiRedis,
  SiTensorflow,
  SiTypescript,
  SiYandexcloud,
} from 'react-icons/si'

type TechnologyIcon = IconType | typeof Cloud

const logoByTechnology: Record<string, TechnologyIcon> = {
  Python: SiPython,
  FastAPI: SiFastapi,
  Django: SiDjango,
  Flask: SiFlask,
  React: SiReact,
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  'Node.js': SiNodedotjs,
  PostgreSQL: SiPostgresql,
  Docker: SiDocker,
  Redis: SiRedis,
  RabbitMQ: SiRabbitmq,
  Celery: SiCelery,
  Nginx: SiNginx,
  Git: SiGit,
  'GitHub Actions': SiGithubactions,
  Linux: SiLinux,
  AWS: Cloud,
  'Yandex Cloud': SiYandexcloud,
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  OpenCV: SiOpencv,
}

export function TechnologyLogo({ name }: { name: string }) {
  const Icon = logoByTechnology[name]
  return Icon ? <Icon aria-hidden="true" /> : null
}
