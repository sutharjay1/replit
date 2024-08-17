import Docker from 'dockerode';
import { NextRequest, NextResponse } from 'next/server';

const docker = new Docker({ socketPath: '//./pipe/docker_engine' });

export async function POST(req: NextRequest, res: NextResponse) {

    const { containerId } = await req.json();

    try {
        // Create and start a new container
        const container = docker.getContainer(containerId);
        await container.stop();
        console.log(`Container ${containerId} stopped successfully.`);

        return NextResponse.json({ message: 'Container stopped successfully!', id: containerId, status: 200 }, { status: 200 });

    } catch (error) {
        console.error(`Failed to stop container ${containerId}`, error);

        return NextResponse.json({ message: 'Failed to stop container', error }, { status: 500 });
    }
}