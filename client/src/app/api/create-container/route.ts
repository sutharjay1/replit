import Docker from 'dockerode';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug } from 'random-word-slugs';

const docker = new Docker({ socketPath: '//./pipe/docker_engine' });

export async function POST(req: NextRequest) {
    try {
        // Generate a unique port and container name
        const port = (Math.floor(Math.random() * 1000) + 9000).toString();
        const containerName = generateSlug(2);

        // Create and start a new container
        const container = await docker.createContainer({
            Image: 'replit-socket-server',
            Tty: true,
            ExposedPorts: {
                '9000/tcp': {},
            },
            HostConfig: {
                PortBindings: { '9000/tcp': [{ HostPort: port }] },
            },
            name: containerName // Assign the container name here
        });

        await container.start();

        return NextResponse.json({
            message: 'Container started successfully!',
            id: container.id,
            containerName: containerName,
            port: port
        });

    } catch (error) {
        console.error('Error starting container:', error);
        return NextResponse.json({ message: 'Failed to start container', error }, { status: 500 });
    }
}
