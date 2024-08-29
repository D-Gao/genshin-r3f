interface Story {
  title: string;
  content: string;
}

const one: Story = { title: "朋友", content: "你在期待什么？" };
const two: Story = { title: "感谢观看", content: "期待下次再会！" };
const three: Story = { title: "额", content: "没了..." };

export const stories: Story[] = [one, two, three];

export const getStory = () => {
  const random = Math.floor(Math.random() * stories.length);
  return stories[random];
};
