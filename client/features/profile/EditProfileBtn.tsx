/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/shadcn/combobox";
import { Field, FieldDescription, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet";
import { Textarea } from "@/components/shadcn/textarea";
import { countries } from "@/data/countries";
import { languages } from "@/data/languages";
import { religions } from "@/data/religions";
import { useState } from "react";


export default function EditProfileBtn() {
    let [country, setCountry] = useState('Bangladesh')
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
                        className={`
                            bg-[url("https://i.pravatar.cc/150?img=45")] bg-no-repeat bg-center bg-cover brightness-50
                            w-full h-[150px] cursor-pointer
                            `
                        }
                    >
                        <input
                            type="file"
                            name="coverImage"
                            id="coverImageInput"
                            className="hidden"
                            accept={'image/*'}
                        />
                    </label>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-2">
                    <strong>Profile Image</strong>
                    <label
                        htmlFor="profileImageInput"
                        className={`
                            bg-[url("https://i.pravatar.cc/150?img=45")] bg-no-repeat bg-center bg-cover brightness-50
                            w-[100px] h-[100px] rounded-full cursor-pointer
                            `
                        }
                    >
                        <input
                            type="file"
                            name="profileImage"
                            id="profileImageInput"
                            className="hidden"
                            accept={'image/*'}
                        />
                    </label>
                </div>
                <Field>
                    <FieldLabel htmlFor="name-input">Name</FieldLabel>
                    <Input name="name" id="name-input" type="text" placeholder="Enter Your Name" />
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="bio-input">Bio</FieldLabel>
                    <Input name="bio" id="bio-input" type="text" placeholder="Enter Your Bio" />
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>


                <Field>
                    <FieldLabel>Address</FieldLabel>
                    <div className="flex flex-row justify-start items-center w-full gap-x-3">
                        <Input placeholder="City" id="city-input" name="city" className="w-fit" />
                        <Combobox defaultInputValue={'Bangladesh'}>
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
                </Field>
                <Field>
                    <FieldLabel htmlFor="website-input">Website</FieldLabel>
                    <Input name="website" id="website-input" type="text" placeholder="Enter Your website url" />
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="language-input">Language</FieldLabel>
                    <div className="flex flex-row justify-start items-center gap-x-2 box-border">
                        <Combobox>
                            <ComboboxInput className={'w-[30%]'} name="language" id="language-input" type="text" placeholder="Language" />
                            <ComboboxContent >
                                <ComboboxEmpty>No Language Found</ComboboxEmpty>
                                <ComboboxList  >
                                    {languages.map((lang, key) => <ComboboxItem key={key} value={lang} >{lang}</ComboboxItem>)}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <Combobox  >
                            <ComboboxInput className={'w-[30%]'} name="language" id="language-input" type="text" placeholder="Language" />
                            <ComboboxContent >
                                <ComboboxEmpty>No Language Found</ComboboxEmpty>
                                <ComboboxList  >
                                    {languages.map((lang, key) => <ComboboxItem key={key} value={lang} >{lang}</ComboboxItem>)}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <Combobox   >
                            <ComboboxInput className={'w-[30%]'} name="language" id="language-input" type="text" placeholder="Language" />
                            <ComboboxContent >
                                <ComboboxEmpty>No Language Found</ComboboxEmpty>
                                <ComboboxList  >
                                    {languages.map((lang, key) => <ComboboxItem key={key} value={lang} >{lang}</ComboboxItem>)}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="religion-input">Religion</FieldLabel>
                    <Combobox defaultInputValue={'Islam'}>
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
                    <Textarea name="about" id="about-input" placeholder="write about yourself" className=" resize-y"></Textarea>
                    <FieldDescription className="text-xs"></FieldDescription>
                </Field>
                <SheetFooter className="w-full">
                    <button type="submit" className="bg-[#1c4095] text-white border-none rounded-full p-2 w-full">Save Change</button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
