/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

"use client"
import { Plus, SquarePen } from 'lucide-react'
import Image from 'next/image'
import React, { ChangeEvent, useRef, useState } from 'react'
import { Field, FieldLabel } from '../shadcn/field';
import { Textarea } from '../shadcn/textarea';
import { Input } from '../shadcn/input';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, } from "@/components/shadcn/combobox";
import { interest } from '@/data/interest';
import { toast } from '../shadcn/toast';
import z from 'zod';

type WidthTypes = 'lg' | 'sm' | 'md' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

interface IData {
    title: string;
    images: string[];
    tags: string[];
    interest: string[];
}
export default function CreatePostDialog({ userImage, imageWidth, imageHeight, maxIputBoxWidth = 'lg' }: { userImage: string, imageWidth: number, imageHeight: number, maxIputBoxWidth?: WidthTypes }) {
    let dialogRef = useRef<HTMLDialogElement>(null);
    let [data, setData] = useState<IData>({
        title: '',
        images: [],
        tags: [],
        interest: []
    });
    let [loadingImages, setLoadingImages] = useState<string[]>([]);
    let [dialogError, setDialogError] = useState<string>('');
    let [creatingAPost, setCreatingAPost] = useState<boolean>(false);
    function OpenDialog() {
        dialogRef.current?.showModal();
    }
    function closeDialog() {
        !!dialogRef.current && dialogRef.current.close();
    }
    function addTags(event: any) {
        event.preventDefault();
        if (event.key === 'Enter') {
            if (event.target.value.length > 150) {
                toast.add({ title: 'Tag must be in 120 charecters' });
                event.target.value = null;
                event.target.style.border = '2px solid red';
                setTimeout(() => {
                    event.target.style.border = null;
                }, 5000);
                return;
            }
            if (data.tags.includes(event.target.value.toLowerCase())) {
                event.target.value = null;
                return
            }
            if (data.tags.length >= 10) {
                let tags = data.tags;
                tags.shift();
                tags = [...tags, event.target.value.toLowerCase()];
                setData(prev => ({ ...prev, tags }))
                event.target.value = null;
                return;
            } else {
                let tags = data.tags;
                tags = [...tags , event.target.value.toLowerCase()];
                setData(prev => ({ ...prev, tags }))
                event.target.value = null;
                return
            }
        }
    }
    async function addImages(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        try {
            event.preventDefault();
            if (data.images.length + loadingImages.length >= 5) {
                setDialogError('Only 5 images can be posted');
                setTimeout(() => setDialogError(''), 3500);
                return;
            };
            let files = event.target.files;
            if (!files) return;
            setLoadingImages(['/images/loading.gif']);
            let form = new FormData();
            form.append('image', files[0])
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/assets/upload/image', {
                method: 'POST',
                body: form
            });
            if (response.status !== 200) {
                toast.add({ title: 'failed to Upload Image' });
                setLoadingImages([]);
            }
            if (response.status === 200) {
                let { data } = await response.json();
                setLoadingImages([]);
                setData((prev) => ({ ...prev, images: [...prev.images, data?.url] }));
            }

        } catch (error) {
            console.error(error);
            setLoadingImages([]);
            toast.add({ title: 'Can upload the Image', description: 'Because of an unknown error, the Image was not uploaded' })
        } finally {
        }
    }
    async function handlePostSubmit() {
        try {
            setCreatingAPost(true)
            let schema = z.object({
                title: z.string()
                    .max(1200, { message: "Title must be at most 1200 characters" }),
                images: z.array(z.url({ message: "Each image must be a valid URL" }))
                    .max(5, { message: "You can upload at most 5 images" })
                    .nonempty({ message: "At least one image is required" }),
                tags: z.array(
                    z.string().trim().max(150, { message: "Each tag must be at most 150 characters" })
                )
                    .max(10, { message: "You can add at most 10 tags" })
                    .nonempty({ message: "At least one tag is required" }),
                interest: z.array(z.enum(interest, { message: "Invalid interest selected" }))
                    .max(3, { message: "You can select at most 3 interests" })
                    .nonempty({ message: "At least one interest is required" })
            });
            let { error, success, data: result } = schema.safeParse(data);
            if (!!error) {
                setDialogError(JSON.parse(error.message)[0].message);
                setTimeout(() => setDialogError(''), 5000);
                return;
            }
            if (!result || !success) return;
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/post/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...result, caption: result.title }),
                credentials : 'include'
            });
            if (response.status === 200 || response.status === 201) {
                dialogRef.current?.close();
                setData({ title: '', images: [], tags: [], interest: [] });
                toast.add({ title: 'Success', description: 'You Have successfully created a Post' })
            } else {
                setDialogError('Because of an server error Post was not created');
                setTimeout(() => setDialogError(''), 5000);
            }
        } catch (error) {
            console.error(error);
            setDialogError('Failed to create a post');
            setTimeout(() => setDialogError(''), 5000);
        } finally {
            setCreatingAPost(false)
        }
    }
    return (
        <div className='w-full flex flex-row justify-center items-start'>
            <button onClick={OpenDialog} className={`flex flex-row justify-start items-center box-border gap-x-3 h-10 my-3 w-full max-w-${maxIputBoxWidth} bg-transparent border-none`}>
                <Image src={userImage || 'https://placehold.co/400x400/cccccc/cccccc'} alt='User' width={imageWidth} height={imageHeight} className='border-2 border-[#1c4095] object-cover  aspect-square rounded-full' />
                <div className="flex flex-row w-full justify-start items-center border-none h-full rounded-full bg-[#1c40952c] p-2 gap-x-1.5">
                    <SquarePen size={20} />
                    <input type="text" className='outline-none border-none bg-transparent placeholder:text-gray-500 h-full' placeholder='What You are thinking?' />
                </div>
                <span className="border-none text-[#1c4095] text-lg ">Post</span>
            </button>
            <dialog
                ref={dialogRef}
                className='fixed box-border w-full left-[50%] top-[50%] m-0 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl backdrop:bg-black/50'
            >
                <div className='flex flex-col justify-start items-start gap-y-2'>

                    <div className='flex w-full items-center justify-between'>
                        <h2 className='text-lg font-semibold text-gray-900'>Create a Post</h2>
                        <button
                            type='button'
                            onClick={closeDialog}
                            className='rounded-md px-2 py-1 text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            aria-label='Close dialog'
                        >
                            &times;
                        </button>
                    </div>
                    {!!dialogError.trim() && <span className="text-red-500 text-sm"> {dialogError}</span>}
                    <div className="w-full h-100 flex flex-col justify-start items-start gap-y-2 overflow-y-scroll overflow-x-hidden">
                        <Field>
                            <FieldLabel htmlFor='post-title' className='text-md'>Title</FieldLabel>
                            <Input
                                id='post-title'
                                type='text'
                                value={data.title}
                                onChange={event => setData(prev => ({ ...prev, title: event.target.value }))}
                                className='w-full h-12 rounded-md border-2 p-2 outline-none focus:border-[#1c4095] focus:ring-1 focus:ring-[#1c4095]'
                                placeholder='Write a title'
                                maxLength={1200}
                            />
                        </Field>
                        <div className="w-full flex flex-col justify-start items-start gap-y-1 5">
                            <strong className=' font-medium text-md'>Images</strong>
                            <div className="flex flex-row flex-wrap justify-start items-start w-full gap-y-2 gap-x-2">

                                {data.images.map((image, index) =>
                                    <div
                                        key={index}
                                        className={`w-30 h-30 relative rounded-md shadow  bg-center bg-cover bg-no-repeat`}
                                        style={{ backgroundImage: `url("${image}")` }}
                                    >
                                        <button
                                            type={'button'}
                                            className='text-white bg-black/20 w-5 h-5 rounded-full absolute right-1.5 top-1.5 flex flex-row justify-center items-center cursor-pointer'
                                            onClick={function (event) {
                                                event.preventDefault();
                                                setData((prev) => ({ ...prev, images: prev.images.filter(img => img !== image) }))
                                            }}
                                        >&times;</button>
                                    </div>
                                )}
                                {loadingImages.map((image, index) =>
                                    <div
                                        key={index}
                                        className={`w-30 h-30 relative rounded-md shadow  bg-center bg-cover bg-no-repeat`}
                                        style={{ backgroundImage: `url("${image}")` }}
                                    >
                                    </div>
                                )}
                                {data.images.length + loadingImages.length < 5 &&
                                    <div className="w-30 h-30 flex flex-row justify-center items-center border-2 border-ray-500 rounded-md shadow">
                                        <input

                                            className=' hidden'
                                            type="file"
                                            name="image"
                                            id="post-images-input"
                                            accept='image/*'
                                            onChange={event => addImages(event)}
                                            multiple={false}
                                        />
                                        <FieldLabel htmlFor='post-images-input' className='w-12 h-12 rounded-full border-none bg-primary flex flex-row justify-center items-center cursor-pointer'>
                                            <Plus size={40} className=' text-white' />
                                        </FieldLabel>
                                    </div>
                                }
                            </div>

                        </div>
                        <div className="flex flex-col justify-start items-start w-full gap-y-1.5">
                            <strong className=' font-medium'>Tags</strong>
                            <div className="flex flex-row flex-wrap justify-start items-start w-full gap-1.5 h-min">
                                {data.tags.map((tag, index) =>
                                    <div
                                        key={index}
                                        className="flex flex-row justify-start items-center flex-wrap w-fit h-fit py-2 px-3 border-2 border-gray-300 rounded-full gap-x-2 ">
                                        <span className='text-gray-800'>{tag}</span>
                                        <button
                                            type={'button'}
                                            className=' cursor-pointer'
                                            onClick={(event) => setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                                        >&times;</button>
                                    </div>
                                )}
                            </div>
                            <Input
                                placeholder='Enter Tags...'
                                className='w-full border-2 h-12'
                                onKeyUp={addTags}
                                maxLength={150}
                            />
                        </div>
                        <div className="flex flex-col justify-start items-start gap-y-2 w-full">
                            <strong className=' font-medium'>Interest</strong>
                            <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
                                {interest.map((interest, index) =>
                                    <div
                                        onClick={function () {
                                            if (data.interest.includes(interest)) setData(prev => ({ ...prev, interest: data.interest.filter((t) => t !== interest) }));
                                            else setData(prev => data.interest.length < 5 ? ({ ...prev, interest: [...data.interest, interest] }) : prev)
                                        }}
                                        key={index}
                                        className={`flex flex-row flex-wrap justify-between items-center px-2 py-1 gap-x-2 gap-y-2 rounded-full cursor-pointer ${data.interest.includes(interest) ? 'bg-primary text-white border-none' : 'border-2 border-gray-300'}`}>
                                        <span >{interest.replaceAll('_', ' ')}</span>
                                        <button className='font-bold'>
                                            {data.interest.includes(interest) ? '-' : "+"}
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                        
                    </div>
                    <button
                        disabled={creatingAPost}
                        onClick={handlePostSubmit}
                        className='w-full rounded-lg bg-[#1c4095] px-4 py-2 text-white hover:bg-[#153274] disabled:opacity-40 transition-colors'
                    >
                        Post
                    </button>

                </div>
            </dialog>
        </div>
    )
}
