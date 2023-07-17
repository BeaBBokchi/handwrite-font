import argparse
from datetime import datetime

# from matplotlib import axis
from torchvision import transforms, utils
import os
from PIL import Image
from pathlib import Path

import torch
from torchvision import utils
from model import Generator, Encoder
from torch.utils import data

TRANSFORM = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
)


def get_name(path):
    name, _ = os.path.splitext(os.path.basename(path))
    return name


def gothic_weight(g_ema, encoder, device):
    # 가중치 변화 없이
    s = datetime.now().strftime("%Y-%m-%d%H%M%S")

    with torch.no_grad():
        # 평가 모드 키기
        g_ema.eval()
        encoder.eval()

        content = Path("web/img/content")
        content_img = content / "밤.png"

        # style_r1 = Path("web/img/style/GothicA1-Black").glob("**/*.png")
        # style_r2 = Path("web/img/style/GothicA1-Light").glob("**/*.png")

        # style_r1 = Path("web/img/style/Cafe24Ssurround").glob("**/*.png")
        # style_r2 = Path("web/img/style/Cafe24SsurroundAir").glob("**/*.png")

        # style_r1 = Path("web/img/style/국립박물관문화재단클래식B").glob("**/*.png")
        # style_r2 = Path("web/img/style/국립박물관문화재단클래식L").glob("**/*.png")

        style_r1 = Path("web/img/style/SourceHanSerifKR-Heavy").glob("**/*.png")
        style_r2 = Path("web/img/style/SourceHanSerifKR-ExtraLight").glob("**/*.png")

        r_bold = torch.stack(
            [TRANSFORM(Image.open(i).convert("RGB")) for i in style_r1]
        ).to(device)
        r_bold_batches = torch.split(r_bold, 1)

        r_thin = torch.stack(
            [TRANSFORM(Image.open(i).convert("RGB")) for i in style_r2]
        ).to(device)
        r_thin_batches = torch.split(r_thin, 1)

        cl_bold, cl_thin = [], []
        for i in range(len(r_bold_batches)):
            _cl_b = encoder(r_bold_batches[i])
            _cl_t = encoder(r_thin_batches[i])

            cl_bold.append(_cl_b[-1])
            cl_thin.append(_cl_t[-1])

        b_feat = torch.cat(cl_bold).mean(dim=0, keepdim=True)
        th_feat = torch.cat(cl_thin).mean(dim=0, keepdim=True)

        content_tensor = TRANSFORM(Image.open(content_img).convert("RGB")).to(device)
        cnt_feat = encoder(content_tensor.unsqueeze(0))[-1]

        th_axis, _ = g_ema([cnt_feat, th_feat], inject_index=4, input_is_latent=True)

        bold_axis, _ = g_ema([cnt_feat, b_feat], inject_index=4, input_is_latent=True)

        # th_feat_save = th_feat.clone().detach()

        max_index = torch.argmax(abs(th_feat - b_feat))
        weight_interpolation = torch.linspace(th_feat[0][0], b_feat[0][0], steps=10)
        print(th_feat[0][0], b_feat[0][0])
        print(weight_interpolation)

        result = []
        result.append(th_axis.squeeze(0))
        for w in weight_interpolation:
            th_feat[0][0] = w
            sample, _ = g_ema([cnt_feat, th_feat], inject_index=4, input_is_latent=True)
            result.append(sample.squeeze(0))

        result.append(bold_axis.squeeze(0))

        result = torch.cat(result, dim=-1)
        root = Path().absolute()
        save_path = root / "web" / "img" / "result" / "weight" / f"{s}.png"

        utils.save_image(
            result, save_path, normalize=True, range=(-1, 1),
        )

        # th_feat = th_feat_save.clone().detach()
        result = []

        torch.cuda.empty_cache()

    print("DONE")


def generate(g_ema, encoder, device):
    # 가중치 변화 없이
    with torch.no_grad():
        # 평가 모드 키기
        g_ema.eval()
        encoder.eval()

        content = Path("web/img/content")
        content_img = content / "밤.png"

        style = Path("web/img/style")
        thin_round = style / "thin_round.png"
        bold_round = style / "2.png"
        # bold_round = style / "bold_round.png"

        thin_contrast = style / "thin_contrast.png"
        bold_contrast = style / "1.png"
        # bold_contrast = style / "bold_contrast.png"

        thin_serif = style / "thin_serif.png"
        bold_serif = style / "bold_serif.png"

        style_path = [
            [thin_round, bold_round],
            [thin_contrast, bold_contrast],
            [thin_serif, bold_serif],
        ]
        style_feats = []

        for s in style_path:
            thin = TRANSFORM(Image.open(s[0]).convert("RGB")).to(device)
            thin_feat = encoder(thin.unsqueeze(0))[-1]

            bold = TRANSFORM(Image.open(s[1]).convert("RGB")).to(device)
            bold_feat = encoder(bold.unsqueeze(0))[-1]

            style_feats.append([thin_feat, bold_feat])

        content_tensor = TRANSFORM(Image.open(content_img).convert("RGB")).to(device)
        cnt_feats = encoder(content_tensor.unsqueeze(0))[-1]

        for i, s in enumerate(style_feats):
            weight_index = torch.argmax(abs(s[0] - s[1]))
            print(weight_index)

            weight_interpolation = torch.linspace(
                s[0][0][weight_index], s[1][0][weight_index], steps=5,
            )

            result = []
            for w in weight_interpolation:
                s[0][0][weight_index] = w
                sample, _ = g_ema(
                    [cnt_feats, s[0]], inject_index=4, input_is_latent=True
                )
                result.append(sample.squeeze(0))

            result = torch.cat(result, dim=-1)
            root = Path().absolute()
            save_path = root / "web" / "img" / "result" / f"{i + 1}.png"

            utils.save_image(
                result, save_path, normalize=True, range=(-1, 1),
            )

        torch.cuda.empty_cache()

    print("DONE")


if __name__ == "__main__":
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print("Device chosen is ", device)

    parser = argparse.ArgumentParser(description="Generate samples from the generator")

    parser.add_argument(
        "--size", type=int, default=128, help="output image size of the generator"
    )
    parser.add_argument(
        "--sample",
        type=int,
        default=1,
        help="number of samples to be generated for each image",
    )
    parser.add_argument(
        "--pics", type=int, default=30, help="number of images to be generated"
    )
    parser.add_argument("--truncation", type=float, default=1, help="truncation ratio")
    parser.add_argument(
        "--truncation_mean",
        type=int,
        default=4096,
        help="number of vectors to calculate mean for the truncation",
    )
    parser.add_argument(
        "--channel_multiplier",
        type=int,
        default=1,
        help="channel multiplier of the generator. config-f = 2, else = 1",
    )

    args = parser.parse_args()

    # 잠재 공간 설정
    args.latent = 20
    # mapping 네트워크 설정
    args.n_mlp = 8
    root_path = Path().absolute()
    ckpt = root_path / "web" / "checkpoint" / "20_8.pt"
    # ckpt = root_path / "web" / "checkpoint" / "64_8.pt"

    # 생성자 레이어 설정
    g_ema = Generator(
        args.size, args.latent, args.n_mlp, channel_multiplier=args.channel_multiplier
    ).to(device)
    # 인코더 설정
    encoder = Encoder(
        args.size, args.latent, channel_multiplier=args.channel_multiplier
    ).to(device)
    # 가중치 불러오기
    checkpoint = torch.load(ckpt, map_location="cuda:0")

    # 가중치 불러와서 생성자로 설정
    g_ema.load_state_dict(checkpoint["g_ema"])
    encoder.load_state_dict(checkpoint["enc"])

    # truncation 기법인거 같은데 뭔지 모르겠네
    if args.truncation < 1:
        with torch.no_grad():
            mean_latent = g_ema.mean_latent(args.truncation_mean)
    else:
        mean_latent = None

    # 이미지 생성
    # generate(g_ema, encoder, device)
    gothic_weight(g_ema, encoder, device)

