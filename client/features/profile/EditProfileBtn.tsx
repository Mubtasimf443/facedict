/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/shadcn/combobox";
import { Field, FieldDescription, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet";
import { Textarea } from "@/components/shadcn/textarea";
import { toast } from "@/components/shadcn/toast";
import { countries } from "@/data/countries";
import { languages } from "@/data/languages";
import { religions } from "@/data/religions";
import { ChangeEvent, useState } from "react";

interface IProps {
    avatar: string;
    coverImage: string;
    name: string;
    bio: string;
    location: {
        city: string;
        country: string
    },
    website?: string;
    religion: string;
    about?: string;
}
export default function EditProfileBtn(props: IProps) {
    let [name, setName] = useState<string>(props.name);
    let [bio, setBio] = useState<string>(props.bio);
    let [avatar, setAvatar] = useState<string>(props.avatar);
    let [coverImage, setCoverImage] = useState<string>(props.coverImage);
    // let [city, setCity] = useState<string>(props.location.city);
    // let [country, setCountry] = useState<string>(props.location.country);
    let [website, setWebsite] = useState<string>(props.website || '');
    let [religion, setReligion] = useState<string>(props.religion);
    let [about, setAbout] = useState<string>(props.about || '');
    let [isSubmitBtnDisabled, setIsSubmitBtnDisabled]= useState(false);
    async function fileToImageUrl(form: any) {
        let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/assets/upload/image', {
            method: 'post',
            body: form,
            credentials: 'include',
            cache: 'no-cache'
        });
        if (response.status === 200) return (await response.json()).data.url
        else throw new Error('Failed to Upload Image');
    }

    async function coverImageChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        let prevCoverImage= coverImage;
        try {
            let file = event.target.files?.[0]
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size is too big');
                return;
            }
            if (!file.type.includes('image/')) {
                alert('Only image files are allowed');
                return;
            }
            const form = new FormData();
            form.append('image', file);
            setCoverImage('/images/loading.gif')
            setCoverImage(await fileToImageUrl(form));
        } catch (error) {
            console.error(error);
            setCoverImage(prevCoverImage);
            toast.add({ title : 'Failed to change cover Image'})
        }
    }
     async function profileImageChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        let preAvatar= avatar;
        try {
            let file = event.target.files?.[0]
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size is too big');
                return;
            }
            if (!file.type.includes('image/')) {
                alert('Only image files are allowed');
                return;
            }
            const form = new FormData();
            form.append('image', file);
            setAvatar('/images/loading.gif')
            setAvatar(await fileToImageUrl(form));
        } catch (error) {
            console.error(error);
            setCoverImage(preAvatar);
            toast.add({ title : 'Failed to change profile Image'})
        }
    }
    async function submitProfileInfo() {
        try {
            setIsSubmitBtnDisabled(true)
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/profile/info', {
                method: 'put',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    name,
                    bio,
                    avatar,
                    coverImage,
                    religion,
                    about,
                    website
                }),
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                toast.add({ title: 'Info updated successFully' });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                console.log(await response.json());
                throw new Error('Failed to update info');
            }
        } catch (error) {
            console.error(error);
            toast.add({ 
                title: 'Failed to update info', 
                description: 'because of an unknown server error, user info was not updated'
            })
            setIsSubmitBtnDisabled(false)
        }
    }
    return (
        <Sheet >
            <SheetTrigger className={"bg-transparent text-[#1c4095] border-2 border-[#1c4095] rounded-full px-3 cursor-pointer"} >Edit Profile </SheetTrigger>
            <SheetContent className={'w-full box-border px-3 py-2 overflow-x-hidden overflow-y-scroll'}>

                <SheetHeader className="flex flex-row justify-between items-center px-2 w-full">
                    <SheetTitle>Edit Profile</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-start items-start gap-y-2">
                    <strong>Cover Image</strong>
                    <label
                        htmlFor="coverImageInput"
                        className={`bg-no-repeat bg-center bg-cover brightness-50 w-full h-[150px] cursor-pointer`
                        }
                        style={{ backgroundImage: `url("${coverImage}")` }}
                    >
                        <Input
                            type="file"
                            name="coverImage"
                            id="coverImageInput"
                            className="hidden"
                            accept={'image/*'}
                            onChange={coverImageChange}
                        />
                    </label>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-2">
                    <strong>Profile Image</strong>
                    <label
                        htmlFor="profileImageInput"
                        className={` bg-no-repeat bg-center bg-cover brightness-50 w-[100px] h-[100px] rounded-full cursor-pointer`
                        }
                        style={{ backgroundImage: `url("${avatar}")` }}
                    >
                        <Input
                            type="file"
                            name="profileImage"
                            id="profileImageInput"
                            className="hidden"
                            accept={'image/*'}
                            onChange={profileImageChange}
                        />
                    </label>
                </div>
                <Field>
                    <FieldLabel htmlFor="name-input">Name</FieldLabel>
                    <Input
                        name="name"
                        id="name-input"
                        type="text"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="bio-input">Bio</FieldLabel>
                    <Input
                        name="bio"
                        id="bio-input"
                        type="text"
                        placeholder="Enter Your Bio"
                        value={bio}
                        onChange={event => setBio(event.target.value)}
                    />
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>


                {/* <Field>
                    <FieldLabel>Address</FieldLabel>
                    <div className="flex flex-row justify-start items-center w-full gap-x-3">
                        <Input
                            placeholder="City"
                            id="city-input"
                            name="city"
                            className="w-fit"
                            value={city}
                            onChange={({ target }) => setCity(target.value)}
                        />
                        <Combobox onValueChange={val => typeof val === 'string' && setCountry(val)} defaultInputValue={country || 'Bangladesh'} >
                            <ComboboxInput autoComplete={'country'} placeholder="Country" id="country-input" name="country" />
                            <ComboboxContent>
                                <ComboboxEmpty>No Country Found</ComboboxEmpty>
                                <ComboboxList >
                                    {countries.map((country, key) => <ComboboxItem key={key} value={country} >{country}</ComboboxItem>)}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>

                    </div>
                    <FieldDescription></FieldDescription>
                </Field> */}
                <Field>
                    <FieldLabel htmlFor="website-input">Website</FieldLabel>
                    <Input
                        name="website"
                        id="website-input"
                        type="text"
                        placeholder="Enter Your website url"
                        value={website}
                        onChange={event => setWebsite(event.target.value)}
                    />
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="religion-input">Religion</FieldLabel>
                    <Combobox onValueChange={value => typeof value === 'string' && setReligion(value)} defaultInputValue={religion}>
                        <ComboboxInput name="religion" id="religion-input" type="text" placeholder="Select religion" />
                        <ComboboxContent >
                            <ComboboxEmpty>No Religion Found</ComboboxEmpty>
                            <ComboboxList  >
                                {religions.map((religion, key) => <ComboboxItem key={key} value={religion} >{religion}</ComboboxItem>)}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="about-input">About</FieldLabel>
                    <Textarea
                        name="about"
                        id="about-input"
                        placeholder="write about yourself"
                        className=" resize-y"
                        value={about}
                        onChange={e => setAbout(e.target.value)}

                    ></Textarea>
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <SheetFooter className="w-full">
                    <button
                        disabled={isSubmitBtnDisabled}
                        onClick={submitProfileInfo}
                        type="button"
                        className="bg-[#1c4095] text-white border-none rounded-full p-2 w-full cursor-pointer disabled:opacity-50">Save Change</button>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    )
}
