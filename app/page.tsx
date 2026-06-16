"use client";

import CardBox, { skillCard } from "@/components/CardBox";
import Dashboard from "@/components/Dashboard";
import Face from "@/components/Face";
import ErrorModal from "@/components/Modals/ErrorModal";
import Modal from "@/components/Modals/Modal";
import {
  getApiExampleTypes,
  GetApiExampleTypesResponse,
  getApiPokemon,
} from "@/src/api/generated";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [testSkill, setTestSkill] = useState<skillCard[]>([]);
  const [testTypes, setTestTypes] = useState<GetApiExampleTypesResponse>({
    success: false,
    data: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    getApiPokemon().then((resPokemon) => {
      const testSkill: skillCard[] =
        resPokemon.data?.data?.[1]?.skillCards || [];
      setTestSkill(testSkill);
      console.log(testSkill);
    });
  }, []);

  useEffect(() => {
    getApiExampleTypes().then((resType) => {
      const testTypes: GetApiExampleTypesResponse = resType.data || {
        success: false,
        data: [],
      };
      setTestTypes(testTypes);
    });
  }, []);

  return (
    <div>
      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></Modal>
      <ErrorModal
        title="Error"
        content="Error message"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
      <Dashboard>
        {testSkill?.map((skillCard, index) => (
          <CardBox
            key={index}
            card={skillCard}
            recommended={index === 0}
            type={testTypes.data}
          />
        ))}
      </Dashboard>
      <div className="flex flex-col justify-center">
        {testTypes.data?.map((type) => (
          <div key={type.id} className="flex flex-row gap-2">
            <Face
              imageUrl1={type.typeImage as string}
              name1={type.enName as string}
            />
            <p className="font-salsa">{type.enName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
