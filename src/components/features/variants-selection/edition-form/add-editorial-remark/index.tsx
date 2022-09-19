import { useState } from "react";
import { useTranslation } from "next-i18next";

import BaseButton from "@/components/ui/button";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown";
import TextArea from "@/components/ui/textarea";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

import { useGetEditorialRemarks } from "./query";

type AddEditorialRemarkProps = {
  initialEditorialRemark?: API.EditorialRemark;
  showEditorialRemark: boolean;
  toggleEditorialRemarkVisibility: () => void;
  onEditorialRemarkSelect: (editorialRemark: API.EditorialRemark) => void;
};

const Button = styled(BaseButton)`
  margin: 6px auto 6px 0;
`;

const TextAreaWrapper = styled.div`
  margin-top: 2px;
`;

function isEditorialRemarkType(value: string): value is API.EditorialRemarkType {
  const editorialRemarkTypes: API.EditorialRemarkType[] = ["conj.", "corr.", "em.", "st."];

  return editorialRemarkTypes.includes(value as API.EditorialRemarkType);
}

function useAddEditorialRemark(defaultValue: boolean) {
  const [showEditorialRemark, setShowEditorialRemark] = useState(defaultValue);

  return {
    showEditorialRemark,
    setShowEditorialRemark,
  };
}

function AddEditorialRemark({
  initialEditorialRemark,
  showEditorialRemark,
  toggleEditorialRemarkVisibility,
  onEditorialRemarkSelect,
}: AddEditorialRemarkProps) {
  const { t } = useTranslation();
  const [editorialRemarkValue, setEditorialRemarkValue] = useState(initialEditorialRemark?.t);
  const [editorialRemarkType, setEditorialRemarkType] = useState(initialEditorialRemark?.type);
  const { data, error, isLoading } = useGetEditorialRemarks();

  if (isLoading && !data) return <Typography>{t("project.editorial_remark_loading")}</Typography>;

  if (error && !data) return <Typography>{t("project.editorial_remark_error")}</Typography>;

  if (!data) return null;

  const editorialRemarks = Object.entries(data).map(([key, value]) => ({
    label: key,
    value,
  }));

  const handleEditorialRemarkSelect = ({ t, type }: API.EditorialRemark) => {
    setEditorialRemarkValue(t);
    setEditorialRemarkType(type);
    onEditorialRemarkSelect({
      t,
      type,
    });
  };

  return showEditorialRemark ? (
    <>
      <Typography variant="body-bold">{t("project.editorial_remark_title")}</Typography>
      <Dropdown
        label={t("project.editorial_remark_type")}
        onChange={options => {
          const selectedEditorialRemark = options[0];

          if (
            typeof selectedEditorialRemark === "string" &&
            isEditorialRemarkType(selectedEditorialRemark)
          ) {
            handleEditorialRemarkSelect({
              t: editorialRemarkValue || "",
              type: selectedEditorialRemark,
            });
          }
        }}
      >
        {editorialRemarks.map(({ label, value }) => (
          <DropdownItem
            key={value}
            label={label}
            value={value}
            selected={editorialRemarkType === value}
          />
        ))}
      </Dropdown>
      <TextAreaWrapper>
        <TextArea
          id={"editorialRemark"}
          value={editorialRemarkValue}
          label={t("project.editorial_remark_content")}
          onChange={event =>
            handleEditorialRemarkSelect({
              t: event.currentTarget.value,
              type: editorialRemarkType || "em.",
            })
          }
          resize
          adjustInitialHeightToContent
        />
      </TextAreaWrapper>
    </>
  ) : (
    <Button variant="tertiary" small type="button" onClick={toggleEditorialRemarkVisibility}>
      {t("project.add_editorial_remark")}
    </Button>
  );
}

export { useAddEditorialRemark };
export default AddEditorialRemark;
