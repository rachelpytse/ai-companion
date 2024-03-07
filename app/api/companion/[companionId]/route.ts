import prismadb from "@/lib/prismadb"
import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: {companionId: string}}) {
    try{
        const body = await req.json()
        const user = await currentUser()
        const {src, name, description, instructions, seed, categoryId} = body

        if(!params.companionId) {
            return new NextResponse("Companion ID is required", {status: 400})
        }

        if(!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!user || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", {status: 400})
        }

        //TODO: Check for subscription

        const companion = await prismadb.companion.update({
            where: {
                id: params.companionId
            },
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        })

        return NextResponse.json(companion)

    } catch(error) {
        console.log("[COMPANION_PATCH]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE(
    request: Request,
    {params}: {params: {companionId: string}}
) {
    try{
        const {userId} = auth()

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const companion = await prismadb.companion.delete({
            where: {
                userId,
                id: params.companionId,
            }
        })

        return NextResponse.json(companion)
        
    } catch(error) {
        console.log("[COMPANION_DELETE]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}