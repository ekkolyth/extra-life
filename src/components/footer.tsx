import { rileyUrl } from '@/utils/extra-life'

const links = [
    { label: 'Extra Life', href: 'https://www.extra-life.org' },
    { label: "Riley Children's Hospital", href: rileyUrl },
    {
        label: "Children's Miracle Network",
        href: 'https://childrensmiraclenetworkhospitals.org',
    },
    { label: 'Ekko on Twitch', href: 'https://www.twitch.tv/ekkolyth' },
]

export function Footer() {
    return (
        <footer className='border-t border-border'>
            <div className='container mx-auto flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between'>
                <p>&copy; {new Date().getFullYear()} ekkolyth</p>
                <ul className='flex flex-wrap gap-x-6 gap-y-2'>
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                className='hover:text-foreground'
                                href={link.href}
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    )
}
