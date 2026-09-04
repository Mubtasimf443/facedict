/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
import { Button } from '@/components/shadcn/button'
import { toast } from '@/components/shadcn/toast';

export default function ShareProfileBtn() {
    async function onShareProfile(event: any) {
        event.preventDefault();
        navigator.clipboard.writeText(window.location.href);
        toast.add({ title: 'Profile Url Coppied' })
    }
    return (
        <Button className="rounded-full" onClick={onShareProfile}>Share profile</Button>

    )
}
