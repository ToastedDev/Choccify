import { Captcha } from "captcha-canvas";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { FailEmbed, SuccessEmbed } from "../structures/Embed.mjs";
import { sendLogMessage } from "./logs.mjs";

/** @type {import('../utils/types.mjs').Feature} */
export default (client) => {
  client.on("ready", async () => {
    /** @type {import("discord.js").MessageCreateOptions} */
    const options = {
      embeds: [
        new EmbedBuilder()
          .setTitle("Verification")
          .setDescription(
            "To access all the channels in the server, you need to verify you are not a robot. Click the button below to get started!"
          )
          .setColor("Purple"),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("verify")
            .setLabel("Verify")
            .setStyle(ButtonStyle.Success)
        ),
      ],
    };

    const channel = await client.channels.fetch("1034950541693943929");
    channel?.messages.fetch().then((messages) => {
      if (messages.size === 0) {
        channel.send(options);
      } else
        for (const message of messages) {
          message[1].edit(options);
        }
    });
  });

  client.on("interactionCreate", async (int) => {
    if (!int.isButton() || int.customId !== "verify") return;

    const role = int.guild.roles.cache.get("752998537985392711");
    if (int.member.roles.cache.has(role.id))
      return int.reply({
        embeds: [new FailEmbed().setDescription("You're already verified.")],
        ephemeral: true,
      });

    const captcha = new Captcha();
    captcha.async = false; //Sync
    captcha.addDecoy();
    captcha.drawTrace();
    captcha.drawCaptcha();

    const attachment = new AttachmentBuilder(captcha.png, {
      name: "captcha.png",
    });
    const embed = new EmbedBuilder()
      .setTitle("Alright. Let's find out if you're human.")
      .setDescription("Please answer the CAPTCHA below to access the server!")
      .addFields({
        name: "Additional notes:",
        value: `:white_small_square: Type out the traced colored characters from left to right.\n:white_small_square: Ignore the decoy characters spread-around.\n:white_small_square: You don't have to respect characters cases (upper/lower case)!`,
      })
      .setImage("attachment://captcha.png")
      .setColor("Purple");

    const res = await int.reply({
      embeds: [embed],
      files: [attachment],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("answer_captcha")
            .setLabel("Answer")
            .setStyle(ButtonStyle.Secondary)
        ),
      ],
      ephemeral: true,
      fetchReply: true,
    });

    const collector = res.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    collector.on("collect", async (i) => {
      if (i.customId !== "answer_captcha") return;

      const modal = new ModalBuilder()
        .setCustomId("captcha")
        .setTitle("Answer CAPTCHA");

      const inputs = [
        new TextInputBuilder()
          .setCustomId("answer")
          .setLabel("What's your answer?")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ];

      modal.addComponents(
        inputs.map((input) => new ActionRowBuilder().addComponents(input))
      );

      await i.showModal(modal);

      await i
        .awaitModalSubmit({
          filter: (int) => int.customId === "captcha",
          time: 30_000,
        })
        .then(async (modal) => {
          if (
            modal.fields.getTextInputValue("answer").toLowerCase() !==
            captcha.text.toLowerCase()
          ) {
            modal.reply({
              embeds: [
                new FailEmbed().setDescription("You failed. Try again."),
              ],
              ephemeral: true,
            });
            sendLogMessage(
              new FailEmbed()
                .setTitle("Member failed verification")
                .setDescription(
                  `**CAPTCHA**: ${
                    captcha.text
                  }\n**Their answer**: ${modal.fields
                    .getTextInputValue("answer")
                    .toLowerCase()}`
                )
                .setFooter({
                  text: int.member.displayName,
                  iconURL: int.member.displayAvatarURL(),
                })
                .setTimestamp()
            );
            return collector.stop();
          }
          await int.member.roles.add(role.id);
          int.member.roles.remove("1103555155934335026");
          modal.reply({
            embeds: [
              new SuccessEmbed().setDescription("You are now verified!"),
            ],
            ephemeral: true,
          });
          sendLogMessage(
            new SuccessEmbed()
              .setTitle("Member verified")
              .setDescription(`**CAPTCHA**: ${captcha.text}`)
              .setFooter({
                text: int.member.displayName,
                iconURL: int.member.displayAvatarURL(),
              })
              .setTimestamp()
          );
          collector.stop();
        })
        .catch(() => collector.stop());
    });
  });
};
