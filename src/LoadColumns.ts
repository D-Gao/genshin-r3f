import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

const draco_path = "https://www.gstatic.com/draco/v1/decoders/";

const LoadColumns = () => {
  const SM_Qiao01 = useGLTF("/models/SM_Qiao01.glb", draco_path);
  const SM_Qiao02 = useGLTF("/models/SM_Qiao02.glb", draco_path);
  const SM_Qiao03 = useGLTF("/models/SM_Qiao03.glb", draco_path);
  const SM_Qiao04 = useGLTF("/models/SM_Qiao04.glb", draco_path);
  const SM_ZhuZi01 = useGLTF("/models/SM_ZhuZi01.glb", draco_path);
  const SM_ZhuZi02 = useGLTF("/models/SM_ZhuZi02.glb", draco_path);
  const SM_ZhuZi03 = useGLTF("/models/SM_ZhuZi03.glb", draco_path);
  const SM_ZhuZi04 = useGLTF("/models/SM_ZhuZi04.glb", draco_path);

  const columnModels = useMemo(() => {
    return {
      SM_Qiao01,
      SM_Qiao02,
      SM_Qiao03,
      SM_Qiao04,
      SM_ZhuZi01,
      SM_ZhuZi02,
      SM_ZhuZi03,
      SM_ZhuZi04,
    };
  }, [
    SM_Qiao01,
    SM_Qiao02,
    SM_Qiao03,
    SM_Qiao04,
    SM_ZhuZi01,
    SM_ZhuZi02,
    SM_ZhuZi03,
    SM_ZhuZi04,
  ]);

  return { columnModels };
};

export default LoadColumns;
