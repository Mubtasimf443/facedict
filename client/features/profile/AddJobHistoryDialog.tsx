/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
'use client'
import { Button } from '@/components/shadcn/button';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/shadcn/combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { industryTypes } from '@/data/industryTypes';
import { XIcon } from 'lucide-react';
import React, { SubmitEvent, useEffect, useState } from 'react'

export default function AddJobHistoryDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [company, setCompany] = useState<string>('');
    const [industryType, setIndustryType] = useState<string>('');
    const [startDateTime, setStartDateTime] = useState<[number, number, number]>();
    const [endDateTime, setEndDateTime] = useState<[number, number, number]>();
    async function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            setIsFormDisabled(true);
           
        } catch (error) {
            console.error({ error });
        } finally {
            setIsFormDisabled(false);
            setIsDialogOpen(false);
        }
    }
    useEffect(() => {
        console.log({startDateTime, endDateTime, industryType});
    }, [startDateTime , endDateTime, industryType])
    return (
        <Dialog open={isDialogOpen}>
            <DialogTrigger
                onClick={event => setIsDialogOpen(true)}
                className={'bg-transparent text-primary border-2 border-primary rounded-md py-1 px-2 font-medium text-sm'}
            >Add Job History</DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader className='flex flex-row justify-between items-center'>
                    <DialogTitle>Add Education</DialogTitle>
                    <button type='button' onClick={event => setIsDialogOpen(false)} ><XIcon size={20} /></button>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <Field>
                        <FieldLabel htmlFor='title-input'>Job Title</FieldLabel>
                        <Input
                            type='text'
                            name='title'
                            id='title-input'
                            placeholder='Job Title Name'
                            maxLength={255}
                            minLength={5}
                            className='placeholder:text-gray-600'
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            disabled={isFormDisabled}
                            required
                        />
                        <FieldDescription></FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='company-input'>Company Name</FieldLabel>
                        <Input
                            type='text'
                            name='company'
                            id='company-input'
                            placeholder='Company Name'
                            maxLength={255}
                            minLength={10}
                            className='placeholder:text-gray-600'
                            value={company}
                            onChange={event => setCompany(event.target.value)}
                            disabled={isFormDisabled}
                            required
                        />
                        <FieldDescription></FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='company-input'>Industry Type</FieldLabel>
                        <Combobox onValueChange={value => typeof value === 'string' && industryTypes.includes(value) && setIndustryType(value)}>
                            <ComboboxInput
                                placeholder="Industry Type"
                                id="industry_type-input"
                                name="industry_type"
                                type='text'
                                value={industryType}
                                disabled={isFormDisabled}
                                required
                            />
                            <ComboboxContent >
                                <ComboboxEmpty>No Country Found</ComboboxEmpty>
                                <ComboboxList >
                                    {industryTypes.map((type, key) => <ComboboxItem key={key} value={type} >{type}</ComboboxItem>)}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription></FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='start-year-input'>Starting Year</FieldLabel>
                        <Input
                            type={'date'}
                            name='startYear'
                            id='start-year-input'
                            placeholder='Start Year'
                            className='placeholder:text-gray-600'
                            onChange={event => setStartDateTime([event.target.valueAsDate?.getDate() || new Date().getDate(), (event.target.valueAsDate?.getMonth() || new Date().getMonth()) + 1, event.target.valueAsDate?.getFullYear() || new Date().getFullYear()])}
                            disabled={isFormDisabled}
                            required
                        />
                        <FieldDescription></FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='end-year-input'>Ending Year</FieldLabel>
                        <Input
                            type='Date'
                            name='endYear'
                            id='end-year-input'
                            placeholder='End Year'
                            className='placeholder:text-gray-600'
                            onChange={event => setEndDateTime([event.target.valueAsDate?.getDate() || new Date().getDate(), (event.target.valueAsDate?.getMonth() || new Date().getMonth()) + 1, event.target.valueAsDate?.getFullYear() || new Date().getFullYear()])}
                            disabled={isFormDisabled}
                            required
                        />
                        <FieldDescription></FieldDescription>
                    </Field>
                    <div className="flex flex-row justify-start itens-center gap-x-2 w-full">
                        <Button variant={'default'} type={'submit'}>Submit</Button>
                        <Button variant={'outline'} type={'reset'}>Reset</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
