import argparse
from torchvision import transforms, utils
import os
import glob
from PIL import Image
import random


import torch
from torchvision import utils
from model import Generator, Encoder
from tqdm import tqdm
from torch.utils import data
from custom_dataset_loader_test import DatasetFromFolder

SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))
fonts_dir= os.path.join(SCRIPT_PATH, 'dataset_builder/train_fonts')
no_fonts = len(glob.glob(os.path.join(fonts_dir, '*.ttf')))

TRANSFORM = transforms.Compose([transforms.ToTensor(),
                          transforms.Normalize([0.5], [0.5])])

def get_name(path):
    name, _ = os.path.splitext(os.path.basename(path))
    return name

def generate(args, g_ema, encoder, device, mean_latent, test_path, size):
    with torch.no_grad():
        g_ema.eval()
        encoder.eval()
        src_chars = []
        n_chars = 1
        n_src_chars = []
        cl_feats = []
        # Get a list of the src characters.
        # You need to edit
        src_img_path = os.path.join(test_path, "UhBee_charming")
        src_imgs_path = glob.glob(os.path.join(src_img_path, '*.png'))
        
        fonts = sorted(glob.glob(os.path.join(fonts_dir, '*.ttf')))

        # if the image names are numbers, sort by the value rather than asciibetically
        # having sorted inputs means that the outputs are sorted in test mode
        if all(get_name(path).isdigit() for path in src_imgs_path):
            print("true")
            src_imgs_path = sorted(src_imgs_path, key=lambda path: int(get_name(path)))
        else:
            print("false")
            # src_imgs_path = sorted(src_imgs_path)
            src_imgs_path = sorted(src_imgs_path, key=lambda path: str(get_name(path)))
        
        n_chars = len(src_imgs_path)

        for i in range(n_chars):
            src_chars.append(src_imgs_path[i][-5])
                
        for i in range(len(src_chars)):
                
            # preprocess src images
            src_img = TRANSFORM(Image.open(src_imgs_path[i])).to(device)
            src_img = src_img.unsqueeze(0)
            cnt_feats = encoder(src_img)

            # You need to edit
            # sample, _ = g_ema([cnt_feats[-1]], inject_index=7, input_is_latent=True)
            sample, _ = g_ema([cnt_feats[-1]], inject_index=6, input_is_latent=True)
            # sample = torch.cat((src_img, sample), dim =- 1)
            utils.save_image(
                sample,
                # You need to edit
                f"results/{src_chars[i]}.png",
                # f"results/MyHW3/only/{ref_chars[i]}.png",
                nrow=5,
                normalize=True,
                range=(-1, 1),
            )
            if i % 500 == 0:
                print("processed images => ", i)         

if __name__ == "__main__":
    device = torch.device('cuda:2' if torch.cuda.is_available() else 'cpu')
    print("Device chosen is ", device)
    print()

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
        "--ckpt",
        type=str,
        # You need to edit
        default="checkpoint/korean_2350.pt",
        help="path to the model checkpoint",
    )
    parser.add_argument(
        "--channel_multiplier",
        type=int,
        default=1,
        help="channel multiplier of the generator. config-f = 2, else = 1",
    )
    parser.add_argument('--test_path', type=str, default='dataset',
         help="path to the test dataset")
    
    args = parser.parse_args()

    args.latent = 64
    args.n_mlp = 8

    g_ema = Generator(
        args.size, args.latent, args.n_mlp, channel_multiplier=args.channel_multiplier
    ).to(device)
    encoder = Encoder(
        args.size, args.latent, channel_multiplier=args.channel_multiplier
    ).to(device)
    checkpoint = torch.load(args.ckpt, map_location="cuda:0")

    g_ema.load_state_dict(checkpoint["g_ema"])
    encoder.load_state_dict(checkpoint["enc"])

    if args.truncation < 1:
        with torch.no_grad():
            mean_latent = g_ema.mean_latent(args.truncation_mean)
    else:
        mean_latent = None

    generate(args, g_ema, encoder, device, mean_latent, args.test_path, args.size)
