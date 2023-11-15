"use client";

import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TNewPool } from "@/app/types";
import { useNetwork } from "wagmi";
import { NewPoolContext } from "@/context/NewPoolContext";
import { useRouter } from "next/navigation";

const schema = yup.object({
  profileId: yup.string().required("Recipient address is required"),
  name: yup.string().required().min(6, "Must be at least 6 characters"),
  website: yup.string().required().url("Must be a valid website address"),
  description: yup.string().required().min(10, "Must be at least 150 words"),
  fundPoolAmount: yup.number().required("fund pool amount is required"),
  maxAmount: yup.number().required("max amount is required"),
  approvalThreshold: yup.number().required("approval threshold is required"),
  imageUrl: yup.string().required().url("Must be a valid image url"),
  startDate: yup.date().required("Start time is required"),
  endDate: yup.date().required("End time is required"),
  tokenAddress: yup.string().required("Token address is required"),
  useRegistryAnchor: yup.boolean().required("Registry anchor is required"),
});

export default function PoolForm() {
  const nowPlus10Minutes = new Date();
  nowPlus10Minutes.setMinutes(nowPlus10Minutes.getMinutes() + 10);
  const minDate = nowPlus10Minutes.toISOString().slice(0, -8);

  const router = useRouter();
  const { steps, createNewPool } = useContext(NewPoolContext);

  const { chain } = useNetwork();
  const chainId = chain?.id;

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    setIsOpen(false);

    // window.location.assign(`/${poolId}`);
  };

  const onHandleSubmit = async (data: any) => {
    setIsOpen(true);

    const newPoolData: TNewPool = {
      profileId: data.profileId,
      name: data.name,
      website: data.website,
      description: data.description,
      tokenAddress: data.tokenAddress
        ? data.tokenAddress
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      fundPoolAmount: data.fundPoolAmount,
      maxAmount: data.maxAmount,
      approvalThreshold: data.approvalThreshold,
      startDate: data.startDate,
      endDate: data.endDate,
      useRegistryAnchor: data.useRegistryAnchor === "true" ? true : false,
      managers: [],
      // imageUrl: data.imageUrl,
    };

    console.log("newPoolData", newPoolData);

    const { address, poolId } = await createNewPool(
      newPoolData,
      Number(chainId),
    );

    setTimeout(() => {
      setIsOpen(false);
      router.push(`/${chainId}/${poolId}`);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              New Pool
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be stored on IPFS and added as metadata to
              the pool.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Selected Chain
              </label>
              <div className="mt-2">
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  {chain?.name} ({chain?.id})
                </p>
              </div>
            </div>

            <div className="sm:col-span-full">
              <label
                htmlFor="profileId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Registry Profile ID
              </label>
              <div className="mt-2">
                <input
                  {...register("profileId")}
                  type="text"
                  name="profileId"
                  id="profileId"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div>
                  {errors.profileId && (
                    <Error message={errors.profileId?.message!} />
                  )}
                </div>
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The registry profile id of you organization your pool will be
                  linked to
                </p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Pool Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    {...register("name")}
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="sporkdao"
                  />
                </div>
              </div>
              <div>
                {errors.name && <Error message={errors.name?.message!} />}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="website"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Website
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    {...register("website")}
                    type="text"
                    name="website"
                    id="website"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
              <div>
                {errors.website && <Error message={errors.website?.message!} />}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  {...register("description")}
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <div>
                {errors.description && (
                  <Error message={errors.description?.message!} />
                )}
              </div>
              <p className="text-xs leading-5 text-gray-600 mt-2">
                Write a brief description about the pool and who is allowed to
                apply
              </p>
            </div>

            <div className="sm:col-span-full">
              <label
                htmlFor="tokenAddress"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Pool Token Address
              </label>
              <div className="mt-2">
                <input
                  {...register("tokenAddress")}
                  type="text"
                  name="tokenAddress"
                  id="tokenAddress"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The address of the token that will be used to fund the pool.
                  Leave blank to use the native currency.
                </p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="fundPoolAmount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fund Pool Amount
              </label>
              <div className="mt-2">
                <input
                  min={0}
                  {...register("fundPoolAmount")}
                  id="fundPoolAmount"
                  name="fundPoolAmount"
                  type="number"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The amount of tokens to fund the pool with.
                </p>
              </div>
              <div>
                {errors.fundPoolAmount && (
                  <Error message={errors.fundPoolAmount?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="maxAmount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Max Grant Amount
              </label>
              <div className="mt-2">
                <input
                  min={0}
                  {...register("maxAmount")}
                  id="maxAmount"
                  name="maxAmount"
                  type="number"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  The max amount that can be requested by an applicant.
                </p>
              </div>
              <div>
                {errors.maxAmount && (
                  <Error message={errors.maxAmount?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="approvalThreshold"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Approval Threshold
              </label>
              <div className="mt-2">
                <input
                  min={1}
                  {...register("approvalThreshold")}
                  id="approvalThreshold"
                  name="approvalThreshold"
                  type="number"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.approvalThreshold && (
                  <Error message={errors.approvalThreshold?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Date
              </label>
              <div className="mt-2">
                <input
                  min={minDate}
                  {...register("startDate")}
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.startDate && (
                  <Error message={errors.startDate?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="mt-2">
                <input
                  min={minDate}
                  {...register("endDate")}
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.endDate && <Error message={errors.endDate?.message!} />}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="useRegistryAnchor"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Registry Profile Required
              </label>
              <select
                {...register("useRegistryAnchor")}
                id="useRegistryAnchor"
                name="useRegistryAnchor"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue="false"
              >
                <option>true</option>
                <option>false</option>
              </select>

              {/* <div>
                {errors.useRegistryAnchor && (
                  <Error message={errors.useRegistryAnchor?.message!} />
                )}
              </div> */}
            </div>

            {/* <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="imageUrl"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        {...register("imageUrl")}
                        id="imageUrl"
                        name="imageUrl"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3"> */}
        {/* <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              A profile will be created on the registry to maintain your
              project. Additonally an anchor wallet would be created which will
              be controlled by the profile. The anchor creation requires a nonce
              unique to the owner. You can use the anchor wallet to recive funds
              , gather attestations and generate reputation for your project.
            </p>
          </div> */}

        {/* <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-full">
              <label
                htmlFor="profile-owner"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Owner
              </label>
              <div className="mt-2">
                <input
                  {...register("profileOwner")}
                  type="text"
                  name="profileOwner"
                  id="profileOwner"
                  placeholder=" 0x..."
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.profileOwner && (
                  <Error message={errors.profileOwner?.message!} />
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="nonce"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nonce
              </label>
              <div className="mt-2">
                <input
                  {...register("nonce")}
                  type="number"
                  name="nonce"
                  id="nonce"
                  defaultValue={1}
                  placeholder="1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                {errors.nonce && <Error message={errors.nonce?.message!} />}
              </div>
            </div>
          </div> */}
        {/* </div> */}
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 text-white rounded-md px-3 py-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-500 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm"
        >
          Save
        </button>

        <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
      </div>
    </form>
  );
}