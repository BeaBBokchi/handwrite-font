from pathlib import Path
import torch
from torchvision import transforms, utils
import numpy as np
from PIL import Image

from model import Encoder

TRANSFORM = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
)


def make_cache(encoder, style_img_path):

    # content_img = list(content_img_path.glob("**/*"))
    torch.cuda.empty_cache()

    style_img = [
        style_img_path / "1.png",
        style_img_path / "2.png",
        style_img_path / "3.png",
    ]

    print(style_img)
    style_list = []
    for i, style in enumerate(style_img):
        style_tensor = TRANSFORM(Image.open(style).convert("RGB")).to(device)
        style_feat = encoder(style_tensor.unsqueeze(0))
        style_list.append(style_feat[-1])

    output = torch.cat(style_list, dim=0)
    output_np = output.detach().cpu().numpy()
    np.save(root_path / "web" / "cache" / "style", output_np)

    # content_feat = torch.zeros(20)
    # print(content_feat.size())
    # style_feat = torch.zeros(3, 20)

    # content_feat = []
    # for i, content in enumerate(content_img):
    #     content_tensor = TRANSFORM(Image.open(content).convert("RGB")).to(device)
    #     feat = encoder(content_tensor.unsqueeze(0))
    #     content_feat.append(feat[-1])

    #     if i % 50 == 0 and i > 0:
    #         output = torch.cat(content_feat, dim=0)
    #         print(output.size())
    #         output_np = output.detach().cpu().numpy()
    #         np.save(root_path / "web" / "cache" / f"content_{i}", output_np)
    #         del content_feat
    #         del output_np
    #         del output_np
    #         content_feat = []

    #         torch.cuda.empty_cache()

    #     if len(content_feat) != 0:
    #         output = torch.cat(content_feat, dim=0)
    #         print(output.size())
    #         output_np = output.detach().cpu().numpy()
    #         np.save(root_path / "web" / "cache" / f"content_{i}", output_np)

    # if i % 100 == 0:
    #     np.save(root_path / "web" / "cache" / f"content_{i}", content_feat)
    #     print(content_feat.size())
    #     exit()


def make_weight_cache(encoder, style_img_path):

    # content_img = list(content_img_path.glob("**/*"))
    torch.cuda.empty_cache()

    style_img = [
        ["GothicA1-Light", "GothicA1-Black"],  # 고딕
        # ["SourceHanSerifKR-ExtraLight", "SourceHanSerifKR-Heavy"],  # 명조
        # ["Cafe24SsurroundAir", "Cafe24Ssurround"],  # 라운드
        # ["국립박물관문화재단클래식L", "국립박물관문화재단클래식B"],  # 대비
    ]

    style_w = []
    for i, style in enumerate(style_img):
        thin, bold = style[0], style[1]

        thin_img = Path(style_img_path / thin).glob("**/*.png")
        bold_img = Path(style_img_path / bold).glob("**/*.png")

        thin_tensors = torch.stack(
            [TRANSFORM(Image.open(style).convert("RGB")) for style in thin_img]
        ).to(device)
        thin_batch = torch.split(thin_tensors, 1)

        bold_tensors = torch.stack(
            [TRANSFORM(Image.open(style).convert("RGB")) for style in bold_img]
        ).to(device)
        bold_batch = torch.split(bold_tensors, 1)

        del thin_tensors, bold_tensors

        cl_bold, cl_thin = [], []
        for i, b in enumerate(thin_batch):
            cl_b = encoder(bold_batch[i])
            cl_t = encoder(thin_batch[i])

            cl_bold.append(cl_b[-1])
            cl_thin.append(cl_t[-1])

        del bold_batch, thin_batch

        b_feat = torch.cat(cl_bold).mean(dim=0, keepdim=True)
        th_feat = torch.cat(cl_thin).mean(dim=0, keepdim=True)

        style_w.append([b_feat, th_feat])

        torch.cuda.empty_cache()

    # output = torch.cat(style_list, dim=0)
    # output_np = output.detach().cpu().numpy()
    # np.save(root_path / "web" / "cache" / "weight", output_np)

    output = torch.cat(style_w, dim=0)
    output_np = output.detach().cpu().numpy()
    np.save(root_path / "web" / "cache" / "style_1", output_np)


if __name__ == "__main__":

    torch.cuda.empty_cache()

    latent, size = 20, 128
    global root_path
    root_path = Path().absolute()
    ckpt = root_path / "web" / "checkpoint" / "20_8.pt"
    # content_img_path = root_path.parent / "FONT" / "content" / "img" / "font"
    style_img_path = root_path / "web" / "img" / "style"

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(device)

    encoder = Encoder(size, latent, channel_multiplier=1).to(device)

    checkpoint = torch.load(ckpt, map_location="cuda:0")
    encoder.load_state_dict(checkpoint["enc"])

    make_weight_cache(encoder, style_img_path)
