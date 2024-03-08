import prismadb from "@/lib/prismadb";
import { CompanionForm } from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface CompanionIdPageProps {
    params: {
        companionId: string;
    }
}

const CompanionIdPage = async ({
    params
}: CompanionIdPageProps) => {
    const {userId} = auth()
    //TODO: Check subscription

    if(!userId) {
        return redirectToSignIn()
    }

    const compagion = await prismadb.companion.findUnique({
        where: {
            id: params.companionId,
            userId
        }
    })

    const categories = await prismadb.category.findMany()

    return ( 
        <CompanionForm
            initialData={compagion}
            categories={categories}
        />
     );
}
 
export default CompanionIdPage;