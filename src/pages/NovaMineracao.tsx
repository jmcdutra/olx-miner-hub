import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NovaMineracaoModal } from "@/components/modals/NovaMineracaoModal";

const NovaMineracao = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      navigate("/");
    }
  };

  return <NovaMineracaoModal open={open} onOpenChange={handleOpenChange} />;
};

export default NovaMineracao;
